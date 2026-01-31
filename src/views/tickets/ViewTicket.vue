<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import Prism from 'prismjs';
import Swal from 'sweetalert2';

import { fetchWrapper } from '../../helpers/fetchWrapper';
import { useSiteStore } from '../../stores/site.store';
import { Ticket, useTicketsStore } from '../../stores/tickets.store';

/* =======================
   Stores / Route
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
const suppressedEmail = ref<any>(null);

/* reply */
const replyBody = ref('');
const attachments = ref<File[]>([]);

/* server access */
const allowServerAccess = ref(false);
const isRootRestricted = ref(false);
const ipAddress = ref('');
const rootPassword = ref('');
const sudoUser = ref('');
const sudoPassword = ref('');
const sshPort = ref('22');

/* search */
const searchBox = ref('');
const searchResults = ref<Ticket[]>([]);
const searching = ref(false);
const showResults = ref(false);
const spinner = `<div class="spinner-border text-secondary"></div>`;

/* =======================
   Computed
======================= */
const ticketMaskId = computed(() => route.params.id as string);
const isClosed = computed(() => ticket.value?.ticketstatustitle === 'Closed');

const wordCount = computed(() => (replyBody.value.trim() ? replyBody.value.trim().split(/\s+/).length : 0));

/* =======================
   Helpers
======================= */
function formatDate(ts?: number) {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    return `Posted on: ${d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })} ${d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })}`;
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
   Search
======================= */
async function submitSearch() {
    if (!searchBox.value) return;
    searching.value = true;
    showResults.value = true;
    searchResults.value = await ticketsStore.searchTickets(searchBox.value);
    searching.value = false;
}

/* =======================
   API
======================= */
async function loadTicket() {
    const baseUrl = siteStore.getBaseUrl();
    const result = await fetchWrapper.get(`${baseUrl}/tickets/${ticketMaskId.value}`);

    ticket.value = result.ticket;
    posts.value = result.posts || [];
    statusCounts.value = result.st_count || [];
    filesByPost.value = result.files || {};
    suppressedEmail.value = result.suppressed_email || null;

    await nextTick();
    Prism.highlightAll();
}

async function submitReply() {
    if (wordCount.value === 0 || wordCount.value > 500 || isClosed.value) return;

    const baseUrl = siteStore.getBaseUrl();
    const formData = new FormData();
    formData.append('body', replyBody.value);
    attachments.value.forEach((f) => formData.append('attachments[]', f));

    Swal.fire({
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
        Swal.fire('Error', 'Failed to post reply', 'error');
    }
}

/* =======================
   Lifecycle
======================= */
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/tickets', 'Tickets'],
    [`/tickets/${ticketMaskId.value}`, ticketMaskId.value],
]);

siteStore.setPageHeading(`Ticket ${ticketMaskId.value}`);
siteStore.setTitle(`[${ticketMaskId.value}] | View Ticket`);

onMounted(loadTicket);
</script>

<template>
    <!-- SUPPRESSED EMAIL -->
    <div v-if="suppressedEmail" class="alert alert-danger" style="border-radius: 10px">
        <strong>Important Notice:</strong>
        Your email <b>({{ suppressedEmail.email }})</b> has been disabled. Please contact
        <RouterLink class="text-white text-underline" to="/new_ticket_c"> SUPPORT </RouterLink>
    </div>

    <!-- HEADER -->
    <div v-if="ticket" class="row mb-4">
        <div class="col-md-2 pr-1">
            <div class="info-box p-0">
                <span class="info-box-icon border-rad-zero" :class="statusClass(ticket.ticketstatustitle)">
                    <i class="text-white" :class="statusIcon(ticket.ticketstatustitle)" />
                </span>
                <div class="info-box-content">
                    <span class="info-box-number">
                        {{ ticket.ticketstatustitle }}
                    </span>
                    <span class="info-box-text"> Created: {{ formatDate(ticket.dateline) }} </span>
                    <span class="info-box-text"> Updated: {{ formatDate(ticket.lastactivity) }} </span>
                </div>
            </div>
        </div>

        <div class="col-md-10">
            <div class="callout callout-info py-3">
                <h5><i class="fas fa-align-left"></i> Subject</h5>
                <p>{{ ticket.subject }}</p>
            </div>
        </div>
    </div>

    <!-- BODY -->
    <div class="row">
        <!-- SIDEBAR -->
        <div class="col-md-2 folders">
            <!-- SEARCH -->
            <div class="card mb-3">
                <form @submit.prevent="submitSearch">
                    <div class="input-group input-group-sm">
                        <input v-model="searchBox" class="form-control" placeholder="Search by TicketID / Subject" />
                        <button class="btn btn-primary">
                            <i class="fas fa-search" />
                        </button>
                    </div>
                </form>

                <div v-if="showResults" class="results p-2">
                    <template v-if="searchResults.length">
                        <div v-for="row in searchResults" :key="row.ticketid">
                            <RouterLink :to="`/tickets/${row.ticketmaskid}`" class="pb-2 d-inline-block">
                                <span class="badge" :class="ticketStatusClass(Number(row.ticketstatusid))">{{ row.ticketmaskid }}</span>
                                <span style="font-size: 95%">{{ row.subject }}</span>
                            </RouterLink>
                            <div class="float-right" style="font-size: 80%">{{ row.lastactivity_time }}</div>
                            <hr />
                        </div>
                    </template>
                    <div v-else v-html="spinner" />
                </div>
            </div>

            <!-- QUICK FILTER -->
            <div class="card folder_tickets">
                <div class="card-header">
                    <h3 class="card-title">Quick Filter</h3>
                </div>
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item">
                        <RouterLink to="/new_ticket_c" class="nav-link"> <i class="fa fa-plus-circle text-info" /> New Ticket </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/tickets" class="nav-link"> <i class="fas fa-inbox text-primary">&nbsp;</i>ALL </RouterLink>
                    </li>
                    <li v-for="s in statusCounts" :key="s.ticketstatustitle" class="nav-item">
                        <RouterLink :to="`/tickets?view=${s.ticketstatustitle}`" class="nav-link">
                            <i :class="statusIcon(s.ticketstatustitle)" />
                            {{ s.ticketstatustitle }}
                            <span class="badge float-right" :class="statusClass(s.ticketstatustitle)">
                                {{ s.st_count }}
                            </span>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- MAIN -->
        <div class="col-md-10">
            <!-- REPLY -->
            <div class="card mt-3">
                <div class="card-header">Post Reply</div>
                <div class="card-body">
                    <template v-if="isClosed">
                        <span class="alert alert-warning">This ticket is closed. Replies are disabled.</span>
                    </template>
                    <template v-else>
                        <textarea v-model="replyBody" class="form-control" rows="7" />
                        <div class="text-right text-muted">{{ wordCount }} / 500 words</div>
                        <button class="btn btn-primary mt-2" :disabled="wordCount > 500" @click="submitReply">Post Reply</button>
                    </template>
                </div>
            </div>

            <div v-for="post in posts" :key="post.ticketpostid" class="card card-comment">
                <div class="card-body">
                    <strong>{{ post.fullname }}</strong>
                    <div class="text-muted">
                        {{ formatDate(post.dateline) }}
                    </div>

                    <div class="inherit-class" v-html="formatReply(post.contents)" />

                    <div v-if="filesByPost[post.ticketpostid]">
                        <div v-for="f in filesByPost[post.ticketpostid]" :key="f.attach_id" v-html="f.link" />
                    </div>

                    <div v-if="post.liked === 1" class="text-success mt-2">👍 User liked your reply</div>
                    <div v-if="post.liked === 0" class="text-danger mt-2">👎 User disliked your reply</div>

                    <div v-if="post.creator !== '1'" class="text-muted mt-2">
                        Email: <b>{{ post.email }}</b>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'prismjs/themes/prism.css';
@importt '../../assets/css/view_admin_ticket.css';

.results {
    width: 100%;
    overflow-y: auto;
    box-shadow: rgba(0, 0, 0, 0.22) 0 3px 14px;
    border-radius: 0 0 8px 8px;
    height: 200px;
}
</style>
