<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const searchInput = ref('');
const searchResults = ref<SearchResults | null>(null);
const filteredResults = ref<any[][]>([]);
const showResults = ref(false);
const highlightIndex = ref(-1);

const iconMouseDown = ref(false); // <--- declare this
const searchInputEl = ref<HTMLInputElement | null>(null);
const resultsContainerEl = ref<HTMLDivElement | null>(null);

// Computed for the icon
const searchIcon = computed(() => {
    if (!searchInput.value) return '▼';
    return showResults.value ? '▲' : '✖';
});

// Functions used in the template
function onFocus() {
    if (searchInput.value.trim().length >= 1) {
        showResults.value = true;
        filteredResults.value = filterResults(searchInput.value);
    }
}

function onIconClick() {
    if (!showResults.value) {
        showResults.value = true;
        filteredResults.value = filterResults(searchInput.value);
        highlightIndex.value = filteredResults.value.length ? 0 : -1;
    } else {
        showResults.value = false;
    }
}

interface SearchResults {
    results: any[][];
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

async function loadSearchResults() {
    const response = await fetch('ajax.php?choice=none.search_autocomplete');
    searchResults.value = await response.json();
}

async function updateSearchResults(search: string) {
    if (!search) return;

    const response = await fetch(`ajax.php?choice=none.search_autocomplete&search=${encodeURIComponent(search)}`);
    const json = await response.json();

    if (json?.results?.length && searchResults.value) {
        searchResults.value.results.push(...json.results);
    }
}

function ucwords(str: string): string {
    if (['id', 'ip'].includes(str)) return str.toUpperCase();
    return str
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function filterResults(search: string): any[][] {
    if (!searchResults.value) return [];

    return searchResults.value.results.filter((row) => {
        const table = searchResults.value!.tables[row[0]];
        let sliceSize = table.extra ? 1 + table.extra.length : 1;
        sliceSize += table.search.includes(table.id) ? 0 : 1;

        return row.slice(sliceSize).some((field) => typeof field === 'string' && field.toLowerCase().includes(search.toLowerCase()));
    });
}

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
});

function onKeydown(e: KeyboardEvent) {
    if (!filteredResults.value.length) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightIndex.value = highlightIndex.value < filteredResults.value.length - 1 ? highlightIndex.value + 1 : 0;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightIndex.value = highlightIndex.value > 0 ? highlightIndex.value - 1 : filteredResults.value.length - 1;
    } else if (e.key === 'Enter' && highlightIndex.value !== -1) {
        navigate(filteredResults.value[highlightIndex.value]);
    }
}

function navigate(row: any[]) {
    if (!searchResults.value) return;
    const table = searchResults.value.tables[row[0]];
    const serviceId = row[1];
    window.location.href = table.link + serviceId;
}

onMounted(loadSearchResults);
</script>

<template>
    <div class="search-wrapper">
        <input ref="searchInputEl" v-model="searchInput" type="text" class="new-search" @keydown="onKeydown" @focus="onFocus" />
        <span class="search-icon" @mousedown="iconMouseDown = true" @click="onIconClick" v-html="searchIcon" />
        <br />
        <div v-show="showResults" ref="resultsContainerEl" class="search-results-container">
            <div v-for="(row, index) in filteredResults" :key="index" class="search-row" :class="{ active: index === highlightIndex }" tabindex="0" @click="navigate(row)">
                <strong>
                    {{ searchResults!.tables[row[0]].label ?? ucwords(searchResults!.tables[row[0]].table) }}
                </strong>
                &nbsp;
                {{ row[1] }}
            </div>
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
    top: 0;
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
    padding: 5px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.search-row:hover {
    background-color: #f0f8dd;
}

.search-row.active {
    background-color: #d3d3d3;
}
</style>
