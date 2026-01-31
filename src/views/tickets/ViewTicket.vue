<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '../../stores/tickets.store';
import Swal from 'sweetalert2';
import { useRoute } from 'vue-router';
import Prism from 'prismjs';
import { useSiteStore } from '../../stores/site.store.ts';
import { fetchWrapper } from '../..//helpers/fetchWrapper.ts';
//import from '/lib/select2/dist/js/select2.full.min.js';
const ticketsStore = useTicketsStore();
const { ticket, loading, error, ima, custid, sortcol, sortdir, st_count, offset, totalTickets, limit, currentPage, pages, view, search } = storeToRefs(ticketsStore);
const route = useRoute();

/* =======================
   Types
======================= */
interface Ticket {
    ticketmaskid: string;
    ticketstatustitle: string;
    ticketstatusid: string;
    subject: string;
    dateline: number;
    lastactivity: number;
}

interface StatusCount {
    ticketstatustitle: string;
    st_count: number;
}

interface Post {
    ticketpostid: string;
    creator: '1' | '2';
    fullname: string;
    email: string;
    contents: string;
    dateline: number;
    liked?: number;
}

/* =======================
   Props / API data
======================= */
const statusCounts = ref<StatusCount[]>([]);
const posts = ref<Post[]>([]);
const ticketMaskId = computed(() => route.params.id as string);
/* =======================
   UI State
======================= */
const allowServerAccess = ref(false);
const isRootRestricted = ref(false);
const replyBody = ref('');
const wordCount = computed(() => replyBody.value.trim().split(/\s+/).length);

/* =======================
   Computed
======================= */
const statusClass = computed(() => {
    switch (ticket.value?.ticketstatustitle) {
        case 'Open':
            return 'bg-success';
        case 'On Hold':
            return 'bg-warning';
        case 'In Progress':
            return 'bg-secondary';
        default:
            return 'bg-danger';
    }
});

const formattedCreated = computed(() => formatDate(Number(ticket.value?.dateline)));

const formattedUpdated = computed(() => formatDate(Number(ticket.value?.lastactivity)));

/* =======================
   Methods
======================= */
function formatDate(ts?: number) {
    if (!ts) return '';
    return new Date(ts * 1000).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function submitReply() {
    if (wordCount.value === 0 || wordCount.value > 500) return;
    Swal.fire({
        title: '',
        html: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });
    // submit via fetch / axios
}

async function loadTicket() {
    const siteStore = useSiteStore();
    const baseUrl = siteStore.getBaseUrl();
    try {
        const results = await fetchWrapper.get(`${baseUrl}/tickets/${ticketMaskId.value}`);
        ticket.value = results.ticket;
        posts.value = results.ticket_posts;
        console.log(results);
    } catch (err) {
        console.error('Search failed', err);
    }
}

/* =======================
   Lifecycle
======================= */
loadTicket();
onMounted(() => {
    Prism.highlightAll();
});
</script>

<template>
    <div class="row mb-4">
        <div class="col-md-2">
            <div class="info-box p-0">
                <span class="info-box-icon border-rad-zero" :class="statusClass">
                    <i class="fas fa-ticket-alt" />
                </span>
                <div class="info-box-content">
                    <span class="info-box-number">{{ ticket?.ticketstatustitle }}</span>
                    <span class="info-box-text">Created: {{ formattedCreated }}</span>
                    <span class="info-box-text">Updated: {{ formattedUpdated }}</span>
                </div>
            </div>
        </div>

        <div class="col-md-10">
            <div class="callout callout-info py-3">
                <h5><i class="fas fa-align-left" /> Subject</h5>
                <p>{{ ticket?.subject }}</p>
            </div>
        </div>
    </div>
    <ul class="nav nav-pills flex-column">
        <li v-for="s in statusCounts" :key="s.ticketstatustitle" class="nav-item">
            <RouterLink :to="`/tickets?view=${s.ticketstatustitle}`" class="nav-link">
                {{ s.ticketstatustitle }}
                <span class="badge float-right">{{ s.st_count }}</span>
            </RouterLink>
        </li>
    </ul>
    <form class="needs-validation" @submit.prevent="submitReply">
        <textarea v-model="replyBody" class="form-control" rows="7" maxlength="10000" />

        <div class="text-right text-muted">{{ wordCount }} / 500 words</div>

        <button class="btn btn-primary" :disabled="wordCount > 500">Post Reply</button>
    </form>
    <div v-for="post in posts" :key="post.ticketpostid" class="card-comment">
        <strong>{{ post.fullname }}</strong>
        <div class="text-muted">{{ formatDate(post.dateline) }}</div>

        <div v-html="post.contents"></div>

        <div v-if="post.liked === 1" class="text-success">👍 User liked your reply</div>
    </div>
</template>

<style scoped>
.results {
    max-height: 200px;
    overflow-y: auto;
}
</style>
