<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';

interface SearchResults {
    results: (string | number | null)[][];
    tables: Record<number, SearchTable>;
}

interface SearchTable {
    id: string;
    table: string;
    label?: string;
    link: string;
    search: string[];
    extra?: string[];
    prefix?: string;
}

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

const searchInput = ref('');
const searchResults = ref<SearchResults | null>(null);
const filteredResults = ref<any[][]>([]);
const showResults = ref(false);
const highlightIndex = ref(-1);
const lastSearch = ref('');
const arrowClicked = ref(false);
const searchIconEl = ref<HTMLElement | null>(null);
const searchInputEl = ref<HTMLInputElement | null>(null);
const resultsContainerEl = ref<HTMLDivElement | null>(null);

/* -------------------- ICON LOGIC -------------------- */

const searchIcon = computed(() => {
    if (searchInput.value) return '✖';
    return showResults.value ? '▲' : '▼';
});

/* -------------------- DATA LOADING -------------------- */

async function loadSearchResults() {
    try {
        searchResults.value = await fetchWrapper.get(`${baseUrl}/search`);
    } catch (err) {
        console.error(err);
    }
}

async function updateSearchResults(search: string) {
    if (search === lastSearch.value) return;
    lastSearch.value = search;

    try {
        const response = await fetchWrapper.get(`${baseUrl}/search?search=${encodeURIComponent(search)}`);
        if (response?.results && searchResults.value) {
            searchResults.value.results.push(...response.results);
        }
    } catch (err) {
        console.error(err);
    }
}

/* -------------------- SEARCH LOGIC -------------------- */

function filterResults(search: string): any[][] {
    if (!searchResults.value) return [];

    return searchResults.value.results.filter((row) => {
        const table = searchResults.value!.tables[row[0] as number];
        let sliceSize = table.extra ? 1 + table.extra.length : 1;
        sliceSize += table.search.includes(table.id) ? 0 : 1;

        return row.slice(sliceSize).some((field) => typeof field === 'string' && field.toLowerCase().includes(search.toLowerCase()));
    });
}

/* -------------------- HELPERS -------------------- */

function ucwords(str: string): string {
    if (['id', 'ip'].includes(str)) return str.toUpperCase();
    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function highlightMatch(text: string, search: string) {
    if (!search) return text;
    const re = new RegExp(search, 'gi');
    return text.replace(re, (m) => `<b>${m}</b>`);
}

/* -------------------- RENDER LOGIC -------------------- */

function buildInnerHTML(row: any[]): string {
    if (!searchResults.value) return '';

    const table = searchResults.value.tables[row[0]];
    let html = '';

    let sliceSize = 1;
    if (table.extra) {
        sliceSize += table.extra.length;
    }

    sliceSize += 1;

    const searchFields = row.slice(sliceSize);

    searchFields.forEach((field, rawIndex) => {
        if (typeof field !== 'string') return;
        let value = field.trim();
        if (!value) return;

        let index = rawIndex;

        if (table.search.includes(table.id)) {
            index++;
        }

        value = highlightMatch(value, searchInput.value);

        if (table.search[index] !== undefined) {
            let label = table.prefix ? table.search[index].replace(`${table.prefix}_`, '') : table.search[index];

            html += `<span style="color: gray;">${ucwords(label)}</span> ${value}&nbsp;&nbsp;&nbsp;`;
        } else {
            html += `${value}&nbsp;&nbsp;&nbsp;`;
        }
    });

    if (table.extra) {
        table.extra.forEach((extraField, i) => {
            const value = String(row[i + 1] ?? '').trim();
            if (!value) return;

            let label = table.prefix ? extraField.replace(`${table.prefix}_`, '') : extraField;

            html += `<span style="color: gray;">${ucwords(label)}</span> ${value}&nbsp;&nbsp;&nbsp;`;
        });
    }

    return html;
}

/* -------------------- NAVIGATION -------------------- */

function getServiceId(row: any[]): string {
    const table = searchResults.value!.tables[row[0]];
    let index = 1;

    if (table.extra) {
        index += table.extra.length;
    }

    return String(row[index]);
}

function navigate(row: any[]) {
    if (!searchResults.value) return;
    const table = searchResults.value.tables[row[0]];
    const serviceId = getServiceId(row);
    window.location.href = table.link + serviceId;
}

/* -------------------- EVENTS -------------------- */

function onIconClick() {
    if (!showResults.value) {
        // Down arrow behavior: show ALL results
        showResults.value = true;
        filteredResults.value = searchResults.value?.results ?? [];
        highlightIndex.value = filteredResults.value.length ? 0 : -1;
    } else if (!searchInput.value) {
        // Up arrow behavior
        showResults.value = false;
        highlightIndex.value = -1;
    } else {
        // X behavior
        searchInput.value = '';
        showResults.value = false;
        highlightIndex.value = -1;
    }
}

function onKeydown(e: KeyboardEvent) {
    if (!filteredResults.value.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightIndex.value = highlightIndex.value < filteredResults.value.length - 1 ? highlightIndex.value + 1 : highlightIndex.value;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightIndex.value = highlightIndex.value > 0 ? highlightIndex.value - 1 : 0;
    } else if (e.key === 'Enter' && highlightIndex.value !== -1) {
        navigate(filteredResults.value[highlightIndex.value]);
    }
}

function onClickOutside(e: MouseEvent) {
    const target = e.target as Node;
    if (!resultsContainerEl.value?.contains(target) && target !== searchInputEl.value && target !== searchIconEl.value) {
        showResults.value = false;
        highlightIndex.value = -1;
    }
}

/* -------------------- WATCHERS -------------------- */

watch(searchInput, async (value) => {
    highlightIndex.value = -1;

    if (!value) {
        showResults.value = false;
        filteredResults.value = [];
        return;
    }

    if (value.length === 18) {
        await updateSearchResults(value);
    }

    filteredResults.value = filterResults(value);
    showResults.value = true;

    await nextTick();
    if (resultsContainerEl.value) {
        resultsContainerEl.value.style.width = `${resultsContainerEl.value.scrollWidth}px`;
    }
});

/* -------------------- LIFECYCLE -------------------- */

onMounted(async () => {
    await loadSearchResults();
    document.addEventListener('click', onClickOutside);
    searchInputEl.value?.focus();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside);
});
</script>

<script lang="ts">
export default {
    name: 'Searchbox',
};
</script>

<template>
    <div class="search-wrapper">
        <input ref="searchInputEl" v-model="searchInput" type="text" class="new-search" @keydown="onKeydown" />

        <span ref="searchIconEl" class="search-icon" @mousedown="arrowClicked = true" @click="onIconClick" v-html="searchIcon" />

        <div v-show="showResults" ref="resultsContainerEl" class="search-results-container">
            <div v-for="(row, index) in filteredResults" :key="index" class="search-row" :class="{ active: index === highlightIndex }" tabindex="0" @click="navigate(row)">
                <div class="cell label">
                    {{ searchResults!.tables[row[0]].label ?? ucwords(searchResults!.tables[row[0]].table) }}
                </div>
                <div class="cell id">
                    <span v-html="highlightMatch(getServiceId(row), searchInput)"></span>
                </div>
                <div class="cell fields" v-html="buildInnerHTML(row)"></div>
            </div>
            <!--
            <div v-for="(row, index) in filteredResults" :key="index" class="search-row" :class="{ active: index === highlightIndex }" tabindex="0" @click="navigate(row)">
                <strong>
                    {{ searchResults!.tables[row[0]].label ?? ucwords(searchResults!.tables[row[0]].table) }}
                </strong>
                &nbsp;
                <span v-html="highlightMatch(getServiceId(row), searchInput)"></span>
                <div v-html="buildInnerHTML(row)"></div>
            </div>
-->
            <div v-if="filteredResults.length === 0">No Search Results found</div>
        </div>
    </div>
</template>

<style scoped>
.search-wrapper {
    position: relative;
}

.search-icon {
    position: relative;
    left: -20px;
    cursor: pointer;
    user-select: none;
}

.new-search {
    width: 300px;
}

.search-results-container {
    border: 1px solid #ccc;
    background-color: white;
    padding: 10px;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 80vh;
    position: absolute;
    top: 40px;
    left: 47px;
    z-index: 1000;
}

.search-row {
    cursor: pointer;
    display: table-row;
}

.search-row .cell {
    display: table-cell;
    padding-right: 8px;
    vertical-align: top;
    white-space: nowrap;
}

.search-row .cell.label {
    font-weight: bold;
    text-align: right;
}

.search-row .cell.id {
    font-weight: normal;
}

.search-row {
}

.search-row:hover {
    background-color: #f0f8dd;
}

.search-row.active {
    background-color: #d3d3d3;
}
</style>
