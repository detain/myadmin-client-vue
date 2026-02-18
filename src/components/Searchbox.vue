<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import { useRouter } from 'vue-router';

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

interface DisplayField {
    label?: string;
    value: string;
}

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();

const searchInput = ref('');
const searchResults = ref<SearchResults | null>(null);
const filteredResults = ref<any[][]>([]);
const showResults = ref(false);
const highlightIndex = ref(-1);
const lastSearch = ref('');

const searchIconEl = ref<HTMLElement | null>(null);
const searchInputEl = ref<HTMLInputElement | null>(null);
const resultsContainerEl = ref<HTMLDivElement | null>(null);

const searchIcon = computed(() => {
    if (searchInput.value) return '✖';
    return showResults.value ? '▲' : '▼';
});

/* ========================= Data Fetching ========================= */

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

/* ========================= Filtering ========================= */

function filterResults(search: string): any[][] {
    if (!searchResults.value) return [];
    return searchResults.value.results.filter((row) => {
        const table = searchResults.value!.tables[row[0] as number];
        let sliceSize = table.extra ? 1 + table.extra.length : 1;
        sliceSize += table.search.includes(table.id) ? 0 : 1;
        return row.slice(sliceSize).some((field) => typeof field === 'string' && field.toLowerCase().includes(search.toLowerCase()));
    });
}

/* ========================= Utilities ========================= */

function ucwords(str: string): string {
    if (['id', 'ip'].includes(str)) return str.toUpperCase();
    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function splitHighlight(text: string, search: string) {
    if (!search) return [{ text, match: false }];
    const re = new RegExp(`(${search})`, 'gi');
    return text.split(re).map((part) => ({
        text: part,
        match: part.toLowerCase() === search.toLowerCase(),
    }));
}

function getServiceId(row: any[]): string {
    const table = searchResults.value!.tables[row[0]];
    let index = 1;
    if (table.extra) {
        index += table.extra.length;
    }
    return String(row[index]);
}

function buildDisplayFields(row: any[]): DisplayField[] {
    if (!searchResults.value) return [];
    const table = searchResults.value.tables[row[0]];
    const fields: DisplayField[] = [];
    let sliceSize = 1;
    if (table.extra) {
        sliceSize += table.extra.length;
    }
    sliceSize += 1;
    const searchFields = row.slice(sliceSize);
    searchFields.forEach((field, rawIndex) => {
        if (typeof field !== 'string') return;
        const value = field.trim();
        if (!value) return;
        let index = rawIndex;
        if (table.search.includes(table.id)) {
            index++;
        }
        let label = table.search[index];
        if (label) {
            if (table.prefix) {
                label = label.replace(`${table.prefix}_`, '');
            }
            fields.push({
                label: ucwords(label),
                value,
            });
        } else {
            fields.push({ value });
        }
    });
    if (table.extra) {
        table.extra.forEach((extraField, i) => {
            const value = String(row[i + 1] ?? '').trim();
            if (!value) return;
            let label = table.prefix ? extraField.replace(`${table.prefix}_`, '') : extraField;
            fields.push({
                label: ucwords(label),
                value,
            });
        });
    }
    return fields;
}

/* ========================= Computed Rows (Perf Safe) ========================= */

const displayRows = computed(() =>
    filteredResults.value.map((row) => ({
        row,
        fields: buildDisplayFields(row),
        serviceId: getServiceId(row),
        table: searchResults.value!.tables[row[0]],
    }))
);

/* ========================= Navigation ========================= */

function getRoute(row: any[]) {
    const table = searchResults.value!.tables[row[0]];
    const serviceId = getServiceId(row);
    return table.link + serviceId;
}

function navigate(row: any[]) {
    router.push(getRoute(row));
}

/* ========================= UI Events ========================= */

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

/* ========================= Watchers ========================= */

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

/* ========================= Lifecycle ========================= */

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
        <span ref="searchIconEl" class="search-icon" @click="onIconClick">
            {{ searchIcon }}
        </span>
        <div v-show="showResults" ref="resultsContainerEl" class="search-results-container">
            <router-link v-for="(item, index) in displayRows" v-slot="{ navigate: linkNavigate, href }" :key="index" :to="getRoute(item.row)" custom>
                <a class="search-row" :class="{ active: index === highlightIndex }" :href="href" tabindex="0" @click.prevent="linkNavigate">
                    <!-- Table Label -->
                    <div class="cell label">
                        {{ item.table.label ?? ucwords(item.table.table) }}
                    </div>
                    <!-- Service ID -->
                    <div class="cell id">
                        <template v-for="(part, i) in splitHighlight(item.serviceId, searchInput)" :key="i">
                            <b v-if="part.match">{{ part.text }}</b>
                            <span v-else>{{ part.text }}</span>
                        </template>
                    </div>
                    <!-- Fields -->
                    <div class="cell fields">
                        <div v-for="(field, fIndex) in item.fields" :key="fIndex" class="field-group px-1">
                            <span v-if="field.label" class="field-label px-1" style="color: gray">
                                {{ field.label }}
                            </span>
                            <template v-for="(part, pIndex) in splitHighlight(field.value, searchInput)" :key="pIndex">
                                <b v-if="part.match">{{ part.text }}</b>
                                <span v-else>{{ part.text }}</span>
                            </template>
                        </div>
                    </div>
                </a>
                <div v-if="displayRows.length === 0">No Search Results found</div>
            </router-link>
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
    /* overflow-x: auto; */ /* allow horizontal scroll if needed */
    overflow-x: hidden;
    border: 1px solid #ccc;
    background-color: white;
    padding: 10px;
    white-space: nowrap;
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
    white-space: nowrap; /* Force entire row to one line */
    text-decoration: none;
    color: inherit;
}

.search-row .cell {
    display: table-cell;
    padding-right: 8px;
    vertical-align: top;
    white-space: nowrap; /* Prevent wrapping inside cells */
    overflow: hidden; /* Prevent expansion */
    text-overflow: ellipsis; /* Truncate overflow */
}

.search-row .cell.label {
    font-weight: bold;
    text-align: right;
}

.search-row .cell.id {
    font-weight: normal;
}

.search-row:hover {
    background-color: #f0f8dd;
}

.search-row.active {
    background-color: #d3d3d3;
}

.field-group {
    display: inline-block; /* Prevent block line breaks */
    white-space: nowrap;
}
</style>
