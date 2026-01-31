<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { Ticket, useTicketsStore } from '../../stores/tickets.store';
import { useSiteStore } from '../../stores/site.store.ts';

const route = useRoute();
const router = useRouter();
const ticketsStore = useTicketsStore();
const { tickets, st_count, pages, currentPage, view } = storeToRefs(ticketsStore);
const selectedPeriod = ref(route.query.period ?? '30');
const siteStore = useSiteStore();

siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/tickets`, 'Tickets'],
]);

watch(selectedPeriod, (val) => {
    router.push({
        query: {
            ...route.query,
            page: undefined,
            period: val === '30' ? undefined : val,
        },
    });
});

watch(
    () => route.query,
    () => ticketsStore.fetchTickets(route.query),
    { immediate: true }
);

/* Search */
const searchBox = ref('');
const showResults = ref(false);
const searching = ref(false);
const searchResults = ref<Ticket[]>([]);
const spinner = '<div class="spinner-border text-secondary"></div>';

async function submitSearch() {
    if (!searchBox.value) return;
    searching.value = true;
    showResults.value = true;
    searchResults.value = await ticketsStore.searchTickets(searchBox.value);
    searching.value = false;
}

/* Pagination */
function goToPage(page: number) {
    router.push({ query: { ...route.query, page } });
}

/* UI helpers */
const periodLabel = computed(() => {
    const map: Record<string, string> = {
        '30': 'Last 30 Days',
        '90': 'Last 90 Days',
        '365': 'Last 1 Year',
        '1825': 'Last 5 Years',
        all: 'All Time',
    };
    return map[selectedPeriod.value as string];
});

function statusIcon(status: string) {
    return {
        Open: 'far fa-envelope-open text-success',
        'On Hold': 'fa fa-pause text-warning',
        Closed: 'far fa-envelope text-danger',
        'In Progress': 'fa fa-hourglass-half text-secondary',
    }[status];
}

function statusBadge(status: string) {
    return {
        Open: 'badge bg-success',
        'On Hold': 'badge bg-warning',
        Closed: 'badge bg-danger',
        'In Progress': 'badge bg-secondary',
    }[status];
}

const statusClassMap: Record<number, string> = {
    4: 'bg-primary',
    5: 'bg-warning',
    6: 'bg-danger',
    7: 'bg-success',
};

const ticketStatusClass = (id: number) => statusClassMap[id] ?? '';

function timeAgo(input: string | number) {
    const ts = typeof input === 'number' ? input * 1000 : Date.parse(input);
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
</script>

<template>
    <div class="row">
        <!-- Sidebar -->
        <div id="sidebar" class="col-md-2 folders">
            <!-- Search -->
            <div class="card mb-3">
                <form @submit.prevent="submitSearch">
                    <div class="input-group input-group-sm">
                        <input v-model="searchBox" class="form-control" placeholder="Search by TicketID / Subject" />
                        <button class="btn btn-primary" :disabled="searching"><i class="fas fa-search" /></button>
                    </div>
                </form>
                <div v-if="showResults" class="results p-2">
                    <template v-if="searchResults?.length">
                        <div v-for="row in searchResults" :key="row.ticketid">
                            <RouterLink :to="`/tickets/${row.ticketmaskid}`" class="pb-2 d-inline-block">
                                <span class="badge" :class="ticketStatusClass(Number(row.ticketstatusid))">{{ row.ticketmaskid }}</span>
                                <span style="font-size: 95%">{{ row.subject }}</span>
                            </RouterLink>
                            <div class="float-right" style="font-size: 80%">{{ row.lastactivity_time }}</div>
                            <hr />
                        </div>
                    </template>
                    <template v-else>
                        <div v-html="spinner" />
                    </template>
                </div>
            </div>
            <!-- Period Filter -->
            <div class="card mb-3">
                <div class="card-header"><h3 class="card-title">Filter by Age</h3></div>
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
            <!-- Quick Filters -->
            <div class="card folder_tickets mb-2">
                <div class="card-header"><h3 class="card-title">Quick Filter</h3></div>
                <div class="card-body p-0">
                    <ul class="nav nav-pills flex-column">
                        <li class="nav-item">
                            <RouterLink to="/new-ticket" class="nav-link"> <i class="fa fa-plus-circle text-info" /> New Ticket </RouterLink>
                        </li>
                        <li v-for="status in st_count" :key="status.ticketstatustitle" class="nav-item">
                            <RouterLink
                                class="nav-link"
                                :to="{
                                    path: '/tickets',
                                    query: {
                                        view: status.ticketstatustitle,
                                        period: selectedPeriod !== '30' ? selectedPeriod : undefined,
                                    },
                                }">
                                <i :class="statusIcon(status.ticketstatustitle)" /> {{ status.ticketstatustitle }}
                                <span :class="statusBadge(status.ticketstatustitle)">{{ status.st_count }}</span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- Main Content -->
        <div class="col-md-10">
            <div class="card card-primary card-outline">
                <div class="card-header">
                    <h3 class="card-title">{{ view || 'All Tickets' }} – {{ periodLabel }}</h3>
                </div>
                <div class="card-body p-0">
                    <table v-if="tickets.length" class="table table-sm table-striped">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th class="text-left">Subject</th>
                                <th class="text-left">Last Replier</th>
                                <th class="text-left">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="t in tickets" :key="t.ticketmaskid">
                                <td><i :class="statusIcon(t.ticketstatustitle)" /></td>
                                <td><i v-if="Number(t.hasattachments)" class="fas fa-paperclip" /></td>
                                <td class="text-left">
                                    <RouterLink :to="`/tickets/${t.ticketmaskid}`"
                                        ><b>{{ t.ticketmaskid }}</b> – {{ t.subject }}</RouterLink
                                    >
                                </td>
                                <td class="text-left">{{ t.lastreplier }}</td>
                                <td class="text-left">{{ timeAgo(Number(t.lastactivity)) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4 v-else class="p-4">No tickets found!</h4>
                </div>
                <!-- Pagination -->
                <div v-if="pages > 1" class="card-footer">
                    <ul class="pagination pagination-sm justify-content-end">
                        <li v-for="p in pages" :key="p" :class="['page-item', { active: p === currentPage }]">
                            <a class="page-link" @click.prevent="goToPage(p)">{{ p }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
a.btn {
    color: inherit !important;
}

.results {
    width: 100%;
    overflow-y: auto;
    box-shadow: rgba(0, 0, 0, 0.22) 0 3px 14px;
    border-radius: 0 0 8px 8px;
    height: 200px;
}
</style>
