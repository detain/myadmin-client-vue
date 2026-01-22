<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '@/stores/tickets.store';

const route = useRoute();
const router = useRouter();
const store = useTicketsStore();

const { tickets, loading, countArray, rowsOffset, rowsTotal, limit, currentPage, pages, view, period } = storeToRefs(store);

/* -----------------------
   Sidebar Filters
------------------------ */

const selectedPeriod = ref(route.query.period ?? '30');

watch(selectedPeriod, (val) => {
    router.push({
        query: {
            ...route.query,
            page: undefined,
            period: val === '30' ? undefined : val,
        },
    });
});

const viewType = computed(() => route.query.view ?? 'all');

const statusTitle = computed(() => {
    switch (viewType.value) {
        case 'open':
            return 'Open Tickets';
        case 'hold':
            return 'Awaiting Reply';
        case 'closed':
            return 'Closed Tickets';
        default:
            return 'All Tickets';
    }
});

/* -----------------------
   Search Widget
------------------------ */

const searchBox = ref('');
const showResults = ref(false);
const searching = ref(false);
const searchResults = ref<string>('');

async function submitSearch() {
    if (!searchBox.value.trim()) return;

    searching.value = true;
    showResults.value = true;
    searchResults.value = '';

    const result = await store.searchTickets(searchBox.value);
    searchResults.value = result;
    searching.value = false;
}

function dismissResults(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.results')) {
        showResults.value = false;
        searchResults.value = '';
    }
}

document.addEventListener('click', dismissResults);

/* -----------------------
   Pagination
------------------------ */

function goToPage(page: number) {
    router.push({
        query: {
            ...route.query,
            page,
        },
    });
}

/* -----------------------
   Time Ago Formatter
------------------------ */

function timeAgo(input: string | number) {
    let ts = typeof input === 'number' ? input * (input.toString().length === 10 ? 1000 : 1) : Date.parse(input);

    if (isNaN(ts)) return input;

    const diff = Math.floor((Date.now() - ts) / 1000);

    const units = [
        [60, 'second'],
        [3600, 'minute'],
        [86400, 'hour'],
        [604800, 'day'],
        [2629746, 'week'],
        [31556952, 'month'],
    ];

    for (let i = 0; i < units.length; i++) {
        if (diff < units[i][0]) {
            const value = Math.floor(diff / (i ? units[i - 1][0] : 1));
            return `${value} ${units[i][1]}${value > 1 ? 's' : ''} ago`;
        }
    }

    return `${Math.floor(diff / 31556952)} years ago`;
}

/* -----------------------
   Init
------------------------ */

watch(
    () => route.query,
    () => store.fetchTickets(route.query),
    { immediate: true }
);
</script>

<template>
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-2 folders">
            <div class="card mb-3">
                <div class="input-group input-group-sm">
                    <input v-model="searchBox" class="form-control" placeholder="Search by TicketID / Subject" />
                    <button class="btn btn-primary" @click.prevent="submitSearch">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <div v-if="showResults" class="results p-2" v-html="searching ? '<div class=spinner-border></div>' : searchResults" />
            </div>

            <div class="card mb-3">
                <div class="card-header">
                    <h3 class="card-title">Filter by Age</h3>
                </div>
                <div class="card-body p-2">
                    <select v-model="selectedPeriod" class="form-control form-control-sm">
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="365">Last 1 Year</option>
                        <option value="1825">Last 5 Years</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            <div class="card">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <RouterLink to="/tickets/new" class="nav-link"> <i class="fa fa-plus-circle text-info"></i> New Ticket </RouterLink>
                    </li>

                    <li v-for="(count, status) in countArray" :key="status" class="nav-item">
                        <RouterLink class="nav-link" :to="{ query: { view: status.toLowerCase(), period: selectedPeriod } }">
                            {{ status }}
                            <span class="badge float-right">{{ count }}</span>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Tickets -->
        <div class="col-md-10">
            <div class="card card-primary card-outline">
                <div class="card-header">
                    <h3 class="card-title">{{ statusTitle }}</h3>
                </div>

                <div class="card-body p-0">
                    <h4 v-if="loading" class="p-4">Loading…</h4>

                    <table v-else-if="tickets.length" class="table table-hover table-striped">
                        <tbody>
                            <tr v-for="ticket in tickets" :key="ticket.ticketid">
                                <td>
                                    <i
                                        :class="{
                                            'far fa-envelope-open text-success': ticket.status === 'Open',
                                            'fa fa-pause text-warning': ticket.status === 'On Hold',
                                            'far fa-envelope text-danger': ticket.status === 'Closed',
                                        }" />
                                </td>

                                <td>
                                    <RouterLink :to="`/tickets/${ticket.ticketmaskid}`">
                                        <b>{{ ticket.ticketmaskid }}</b> - {{ ticket.subject }}
                                    </RouterLink>
                                </td>

                                <td>{{ ticket.lastreplier }}</td>
                                <td>{{ timeAgo(ticket.lastactivity) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4 v-else class="p-4">No tickets found!</h4>
                </div>

                <div class="card-footer">
                    <div class="float-right">
                        <button class="btn btn-sm btn-secondary" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">«</button>

                        <button class="btn btn-sm btn-secondary" :disabled="currentPage >= pages" @click="goToPage(currentPage + 1)">»</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.results {
    height: 200px;
    overflow-y: auto;
    box-shadow: rgba(0, 0, 0, 0.22) 0 3px 14px;
    border-radius: 0 0 8px 8px;
}
</style>
