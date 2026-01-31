<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Prism from 'prismjs';
import Swal from 'sweetalert2';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { useSiteStore } from '../../stores/site.store';
import { Ticket, useTicketsStore } from '../../stores/tickets.store';

/* Search */
const searchBox = ref('');
const showResults = ref(false);
const searching = ref(false);
const searchResults = ref<Ticket[]>([]);
const spinner = '<div class="spinner-border text-secondary"></div>';

const statusClassMap: Record<number, string> = {
    4: 'bg-primary',
    5: 'bg-warning',
    6: 'bg-danger',
    7: 'bg-success',
};

const ticketStatusClass = (id: number) => statusClassMap[id] ?? '';

/* =======================
   Store / Route
======================= */
const route = useRoute();
const siteStore = useSiteStore();
const ticketsStore = useTicketsStore();

/* =======================
   Types
======================= */
interface StatusCount {
    ticketstatustitle: string;
    st_count: number;
}

interface Attachment {
    attach_id: string;
    src: string;
    link: string;
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
   State
======================= */
const ticket = ref<Ticket | null>(null);
const posts = ref<Post[]>([]);
const statusCounts = ref<StatusCount[]>([]);
const filesByPost = ref<Record<string, Attachment[]>>({});
const suppressedEmail = ref<any>(false);

const replyBody = ref('');
const attachments = ref<File[]>([]);

const allowServerAccess = ref(false);
const isRootRestricted = ref(false);

/* =======================
   Computed
======================= */
const ticketMaskId = computed(() => route.params.id as string);
const isClosed = computed(() => ticket.value?.ticketstatustitle === 'Closed');
const wordCount = computed(() => {
    if (!replyBody.value.trim()) return 0;
    return replyBody.value.trim().split(/\s+/).length;
});

/* =======================
   Helpers
======================= */

async function submitSearch() {
    if (!searchBox.value) return;
    searching.value = true;
    showResults.value = true;
    searchResults.value = await ticketsStore.searchTickets(searchBox.value);
    searching.value = false;
}

function formatDate(ts?: number) {
    if (!ts) return '';
    const date = new Date(ts * 1000);
    return `Posted on: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

function formatReply(content: string) {
    let html = content.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/<br\s*\/?>/gi, '\n');

    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

    return html;
}

function statusClass(status: string) {
    switch (status) {
        case 'Open':
            return 'bg-success';
        case 'On Hold':
            return 'bg-warning';
        case 'In Progress':
            return 'bg-secondary';
        default:
            return 'bg-danger';
    }
}

function statusIcon(status: string) {
    switch (status) {
        case 'Open':
            return 'far fa-envelope-open text-success';
        case 'On Hold':
            return 'fa fa-pause text-warning';
        case 'In Progress':
            return 'fa fa-hourglass-half text-secondary';
        default:
            return 'far fa-envelope text-danger';
    }
}
/* =======================
   API
======================= */
async function loadTicket() {
    const baseUrl = siteStore.getBaseUrl();
    const result = await fetchWrapper.get(`${baseUrl}/tickets/${ticketMaskId.value}`);
    console.log(result);
    ticket.value = result.ticket;
    posts.value = result.posts;
    statusCounts.value = result.st_count || [];
    filesByPost.value = result.files || {};
    suppressedEmail.value = result.suppressed_email;
    onMounted(() => Prism.highlightAll());
}

async function submitReply() {
    if (wordCount.value === 0 || wordCount.value > 500 || isClosed.value) return;

    const baseUrl = siteStore.getBaseUrl();
    const formData = new FormData();

    formData.append('body', replyBody.value);
    attachments.value.forEach((f) => formData.append('attachments[]', f));

    await Swal.fire({
        title: '',
        html: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });

    try {
        const res = await fetchWrapper.post(`${baseUrl}/tickets/${ticketMaskId.value}/reply`, formData);
        Swal.close();

        if (res.status === 'success') {
            await Swal.fire('Reply Posted', res.message, 'success');
            replyBody.value = '';
            attachments.value = [];
            await loadTicket();
        } else {
            await Swal.fire('Warning', res.message, 'warning');
        }
    } catch {
        Swal.close();
        await Swal.fire('Error', 'Failed to post reply', 'error');
    }
}

/* =======================
   Lifecycle
======================= */
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/tickets`, 'Tickets'],
    [`/tickets/${ticketMaskId.value}`, `${ticketMaskId.value}`],
]);
siteStore.setPageHeading(`Ticket ${ticketMaskId.value}`);
siteStore.setTitle(`[${ticketMaskId.value}] | View Ticket`);

onMounted(loadTicket);
</script>

<template>
    <!-- SUPPRESSED EMAIL ALERT -->
    <div v-if="suppressedEmail" class="alert alert-danger rounded">
        <i class="fas fa-exclamation-circle mr-2"></i>
        <strong>Important Notice:</strong>
        Your email <b>({{ suppressedEmail.email }})</b> has been disabled due to bounces.
        Please <RouterLink to="/new_ticket_c" class="text-white text-underline">contact support</RouterLink>.
    </div>

    <div v-if="ticket" class="row mb-4">
        <div class="col-md-2 pr-1">
            <div class="info-box p-0">
                <span class="info-box-icon border-rad-zero" :class="statusClass(ticket.ticketstatustitle)">
                    <i class="text-white" :class="statusIcon(ticket.ticketstatustitle)" />
                </span>
                <div class="info-box-content">
                    <span class="info-box-number">{{ ticket.ticketstatustitle }}</span>
                    <span class="info-box-text">Created: {{ formatDate(Number(ticket.dateline)) }}</span>
                    <span class="info-box-text">Updated: {{ formatDate(Number(ticket.lastactivity)) }}</span>
                </div>
            </div>
        </div>
        <div class="col-md-10">
            <div class="callout callout-info m-0 py-3">
                <h5><i class="fas fa-align-left"></i> Subject</h5>
                <p>{{ ticket.subject }}</p>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2 folders">
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
            <div class="card folder_tickets">
                <div class="card-header">
                    <h3 class="card-title">Quick Filter</h3>
                </div>
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <RouterLink to="/new_ticket_c" class="nav-link"> <i class="fa fa-plus-circle text-info">&nbsp;</i> New Ticket </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/tickets" class="nav-link"> <i class="fas fa-inbox text-primary">&nbsp;</i>ALL </RouterLink>
                    </li>
                    <li v-for="s in statusCounts" :key="s.ticketstatustitle" class="nav-item">
                        <RouterLink :to="`/tickets?view=${s.ticketstatustitle}`" class="nav-link" :title="s.ticketstatustitle">
                            <i :class="statusIcon(s.ticketstatustitle)"></i>
                            {{ s.ticketstatustitle }}
                            <span class="badge float-right" :class="statusClass(s.ticketstatustitle)">{{ s.st_count }}</span>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-md-10">
            <div v-if="isClosed" class="alert alert-warning">This ticket is closed. Replies are disabled.</div>

            <div v-for="post in posts" :key="post.ticketpostid" class="card">
                <div class="card-body">
                    <strong>{{ post.fullname }}</strong>
                    <div class="text-muted">{{ formatDate(post.dateline) }}</div>
                    <div class="inherit-class" v-html="formatReply(post.contents)"></div>

                    <div v-if="filesByPost[post.ticketpostid]">
                        <div v-for="f in filesByPost[post.ticketpostid]" :key="f.attach_id" v-html="f.link"></div>
                    </div>

                    <div v-if="post.liked === 1" class="text-success mt-2">👍 User liked your reply</div>
                </div>
            </div>

            <div v-if="!isClosed" class="card mt-3">
                <div class="card-header">Post Reply</div>
                <div class="card-body">
                    <textarea v-model="replyBody" class="form-control" rows="7"></textarea>
                    <div class="text-right text-muted">{{ wordCount }} / 500 words</div>
                    <button class="btn btn-primary mt-2" :disabled="wordCount > 500" @click="submitReply">Post Reply</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import 'prismjs/themes/prism.css';
</style>
