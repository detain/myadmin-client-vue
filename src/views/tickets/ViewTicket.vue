<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
import Prism from 'prismjs';
import { Ticket, useTicketsStore } from '../../stores/tickets.store';
import { useSiteStore } from '../../stores/site.store';
import { fetchWrapper } from '../../helpers/fetchWrapper';

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
    email?: string;
    contents: string;
    dateline: number;
    liked?: number;
    files?: Attachment[];
}

/* =======================
   Stores / Route
======================= */
const route = useRoute();
const ticketsStore = useTicketsStore();
const siteStore = useSiteStore();
const { ticket } = storeToRefs(ticketsStore);

/* =======================
   State
======================= */
const posts = ref<Post[]>([]);
const statusCounts = ref<StatusCount[]>([]);
const suppressedEmail = ref<{ email: string } | null>(null);

const allowServerAccess = ref<'y' | 'n'>('n');
const isRootRestricted = ref<'yes' | 'no'>('no');

const ip = ref('');
const rootPass = ref('');
const sudoUser = ref('');
const sudoPass = ref('');
const sshPort = ref('22');

const replyBody = ref('');
const attachments = ref<File | null>(null);

/* =======================
   Computed
======================= */
const ticketMaskId = computed(() => route.params.id as string);

const wordCount = computed(() => {
    const words = replyBody.value.trim().split(/\s+/).filter(Boolean);
    return words.length;
});

const statusClass = computed(() => {
    switch (ticket.value?.ticketstatustitle) {
        case 'Open': return 'bg-success';
        case 'On Hold': return 'bg-warning';
        case 'In Progress': return 'bg-secondary';
        default: return 'bg-danger';
    }
});

function formatDate(ts?: number) {
    if (!ts) return '';
    const date = new Date(ts * 1000);
    return `Posted on: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

/* =======================
   Methods
======================= */
async function loadTicket() {
    const baseUrl = siteStore.getBaseUrl();
    const res = await fetchWrapper.get(`${baseUrl}/tickets/${ticketMaskId.value}`);
    ticket.value = res.ticket as Ticket;
    posts.value = res.posts || [];
    statusCounts.value = res.st_counts || [];
    suppressedEmail.value = res.suppressed_email || null;

    allowServerAccess.value = res.custom?.server_access ?? 'n';
    isRootRestricted.value = res.custom?.is_root ?? 'no';

    ip.value = res.custom?.ip ?? res.client_ip ?? '';
    rootPass.value = res.custom?.root_pass ?? '';
    sudoUser.value = res.custom?.sudo_user ?? '';
    sudoPass.value = res.custom?.sudo_pass ?? '';
    sshPort.value = res.custom?.port_no ?? '22';

    renderContent();
}

function renderContent() {
    setTimeout(() => {
        document.querySelectorAll('.inherit-class').forEach(el => {
            el.innerHTML = el.innerHTML.replace(/`([^`]+)`/g, '<code>$1</code>');
        });
        Prism.highlightAll();
    });
}

async function submitReply() {
    if (wordCount.value === 0 || wordCount.value > 500) return;

    const baseUrl = siteStore.getBaseUrl();
    const form = new FormData();
    form.append('body', replyBody.value);
    if (attachments.value) form.append('file_attachment', attachments.value);

    Swal.fire({ html: 'Please wait...', allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });

    try {
        const res = await fetchWrapper.post(`${baseUrl}/tickets/${ticketMaskId.value}/reply`, form);
        Swal.close();
        if (res.status === 'success') {
            await Swal.fire({ icon: 'success', title: 'Reply Posted!' });
            replyBody.value = '';
            attachments.value = null;
            loadTicket();
        } else {
            Swal.fire({ icon: 'warning', text: res.message });
        }
    } catch {
        Swal.fire({ icon: 'error', text: 'Failed to post reply.' });
    }
}

/* =======================
   Lifecycle
======================= */
onMounted(loadTicket);
watch(posts, renderContent);
</script>

<template>
    <div class="row mb-4">
        <div class="col-md-2 pr-1">
            <div class="info-box p-0">
                <span class="info-box-icon border-rad-zero" :class="statusClass">
                    <i :class="ticket?.ticketstatustitle === 'In Progress' ? 'fas fa-hourglass-half' : 'fas fa-ticket-alt'" />
                </span>
                <div class="info-box-content">
                    <span class="info-box-number">{{ ticket?.ticketstatustitle }}</span>
                    <span class="info-box-text">Created: {{ formatDate(ticket?.dateline) }}</span>
                    <span class="info-box-text">Updated: {{ formatDate(ticket?.lastactivity) }}</span>
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

    <div v-if="suppressedEmail" class="alert alert-danger">
        <strong>Important Notice:</strong> Your email address ({{ suppressedEmail.email }}) has been disabled.
    </div>

    <div class="row">
        <div class="col-md-2">
            <ul class="nav nav-pills flex-column">
                <li class="nav-item">
                    <RouterLink to="/tickets" class="nav-link">All</RouterLink>
                </li>
                <li v-for="s in statusCounts" :key="s.ticketstatustitle" class="nav-item">
                    <RouterLink :to="`/tickets?view=${s.ticketstatustitle}`" class="nav-link">
                        {{ s.ticketstatustitle }}
                        <span class="badge float-right">{{ s.st_count }}</span>
                    </RouterLink>
                </li>
            </ul>
        </div>

        <div class="col-md-10">
            <div class="card mb-3">
                <div class="card-header">Post Reply</div>
                <div class="card-body">
                    <form @submit.prevent="submitReply">
                        <textarea v-model="replyBody" class="form-control" rows="7" />
                        <div class="text-right text-muted">{{ wordCount }} / 500 words</div>
                        <input type="file" class="form-control mt-2" @change="e => attachments = e.target.files?.[0] || null" />
                        <button class="btn btn-primary mt-2" :disabled="wordCount > 500">Post Reply</button>
                    </form>
                </div>
            </div>

            <div v-for="post in posts" :key="post.ticketpostid" class="card mb-2">
                <div class="card-header">
                    <strong>{{ post.fullname }}</strong>
                    <span class="text-muted ml-2">{{ formatDate(post.dateline) }}</span>
                </div>
                <div class="card-body">
                    <div class="inherit-class" v-html="post.contents"></div>
                    <div v-if="post.liked === 1" class="text-success mt-2">👍 User liked your reply</div>
                    <div v-if="post.liked === 0" class="text-danger mt-2">👎 User disliked your reply</div>

                    <div v-if="post.files">
                        <div v-for="f in post.files" :key="f.attach_id" class="mt-2">
                            <a :href="f.src" target="_blank">{{ f.link }}</a>
                        </div>
                    </div>
                </div>
                <div v-if="post.creator !== '1'" class="card-footer">Email: <b>{{ post.email }}</b></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css';
.results { max-height: 200px; overflow-y: auto; }
</style>
