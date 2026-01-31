<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
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

const statusClassMap: Record<number, string> = {
    4: 'bg-primary',
    5: 'bg-warning',
    6: 'bg-danger',
    7: 'bg-success',
};

const ticketStatusClass = (id: number) => statusClassMap[id] ?? '';

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
    bs_input_file();
    await nextTick();
    Prism.highlightAll();
}

async function submitReply() {
    if (wordCount.value === 0 || wordCount.value > 500 || isClosed.value) return;
    const baseUrl = siteStore.getBaseUrl();
    const formData = new FormData();
    formData.append('body', replyBody.value);
    attachments.value.forEach((f) => formData.append('attachments[]', f));
    await Swal.fire({
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

async function closeTicket() {
    const baseUrl = siteStore.getBaseUrl();
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to close this ticket?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, close it!',
    });
    if (result.isConfirmed) {
        try {
            const res = await fetchWrapper.post(`${baseUrl}/tickets/${ticketMaskId.value}/close`, {});
            if (res.status === 'success') {
                await Swal.fire('Ticket Closed', res.message, 'success');
                await loadTicket();
            } else {
                await Swal.fire('Warning', res.message, 'warning');
            }
        } catch {
            await Swal.fire('Error', 'Failed to close ticket', 'error');
        }
    }
}

function bs_input_file(): void {
    document.querySelectorAll<HTMLElement>('.input-file').forEach((wrapper) => {
        // Prevent duplicate ghost inputs
        const next = wrapper.nextElementSibling;
        if (next && next.classList.contains('input-ghost')) {
            return;
        }
        // Create hidden file input
        const ghost = document.createElement('input');
        ghost.type = 'file';
        ghost.className = 'input-ghost';
        ghost.style.visibility = 'hidden';
        ghost.style.height = '0';
        // Copy name attribute
        const name = wrapper.getAttribute('name');
        if (name) ghost.name = name;
        wrapper.parentNode?.insertBefore(ghost, wrapper.nextSibling);
        // Type-safe element lookups
        const chooseBtn = wrapper.querySelector<HTMLButtonElement>('.btn-choose');
        const resetBtn = wrapper.querySelector<HTMLButtonElement>('.btn-reset');
        const textInput = wrapper.querySelector<HTMLInputElement>('input[type="text"]');
        // File selected → update text field
        ghost.addEventListener('change', () => {
            const fileName = ghost.value.split('\\').pop() || '';
            if (textInput) {
                textInput.value = fileName;
            }
        });
        // Choose button opens dialog
        chooseBtn?.addEventListener('click', () => {
            ghost.click();
        });
        // Reset clears everything
        resetBtn?.addEventListener('click', () => {
            ghost.value = '';
            if (textInput) {
                textInput.value = '';
            }
        });
        // Text input behavior
        if (textInput) {
            textInput.style.cursor = 'pointer';
            textInput.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                ghost.click();
            });
        }
    });
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
                    <span class="info-box-text"> Created: {{ formatDate(Number(ticket.dateline)) }} </span>
                    <span class="info-box-text"> Updated: {{ formatDate(Number(ticket.lastactivity)) }} </span>
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
                        <RouterLink to="/tickets/new" class="nav-link"> <i class="fa fa-plus-circle text-info" /> New Ticket </RouterLink>
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
            <div class="card card-body">
                <form method="post" role="form" :action="`ticket_c?id=${ticket?.ticketmaskid}`">
                    <!-- SERVER ACCESS -->
                    <div class="form-group col-md-6 mb-0 pl-0">
                        <div class="custom-control custom-checkbox">
                            <input id="server_access_checkbox" v-model="allowServerAccess" type="checkbox" class="custom-control-input" />
                            <label class="custom-control-label" for="server_access_checkbox">Allow InterServer to modify server:</label>
                        </div>
                        <input type="hidden" name="server_access" :value="allowServerAccess ? 'y' : 'n'" />
                    </div>
                    <!-- TOGGLED SECTION -->
                    <div v-show="allowServerAccess" class="form-toggle">
                        <hr />
                        <div class="form-row">
                            <!-- IP -->
                            <div class="form-group col-md-2">
                                <label for="ip">Your IP Address</label>
                                <input id="ip" v-model="ipAddress" name="ip" type="text" class="form-control form-control-sm" placeholder="Your IP Address" />
                                <span class="help-text text-danger text-sm"> If connection is coming from different IP address. Kindly change it. </span>
                            </div>
                            <!-- ROOT PASSWORD -->
                            <div class="form-group col-md-2 pr-3" style="border-right: 1px solid #cccccc69">
                                <label for="root_pass">Root Password</label>
                                <input id="root_pass" v-model="rootPassword" name="root_pass" type="text" class="form-control form-control-sm" placeholder="VPS / Dedicated Server" />
                                <span class="help-text text-danger text-sm">Passwords are stored in a separate encrypted database.</span>
                            </div>
                            <!-- ROOT RESTRICTED -->
                            <div class="form-group col-md-2 pl-3">
                                <div class="custom-control custom-checkbox">
                                    <input id="is_root_checkbox" v-model="isRootRestricted" type="checkbox" class="custom-control-input" />
                                    <label class="custom-control-label" for="is_root_checkbox">Is SSH Root Restricted?</label>
                                </div>
                                <input type="hidden" name="is_root" :value="isRootRestricted ? 'yes' : 'no'" />
                            </div>
                            <!-- SUDO FIELDS -->
                            <div v-show="isRootRestricted" class="form-group col-md-2">
                                <label for="sudo_user">Sudo Username</label>
                                <input id="sudo_user" v-model="sudoUser" name="sudo_user" type="text" class="form-control form-control-sm" placeholder="Sudo Username" />
                            </div>
                            <div v-show="isRootRestricted" class="form-group col-md-2">
                                <label for="sudo_pass">Sudo Password</label>
                                <input id="sudo_pass" v-model="sudoPassword" name="sudo_pass" type="text" class="form-control form-control-sm" placeholder="Sudo user password" />
                                <span class="help-text text-danger text-sm"> Passwords are stored in a separate encrypted database. </span>
                            </div>
                            <div v-show="isRootRestricted" class="form-group col-md-2">
                                <label for="ssh-port">SSH Port</label>
                                <input id="ssh-port" v-model="sshPort" name="port_no" type="text" class="form-control form-control-sm" placeholder="SSH Port Number" />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="text-center">
                        <button type="submit" name="submit" value="updateTicket" class="btn btn-md btn-outline-primary">Update</button>
                    </div>
                </form>
            </div>

            <!-- REPLY -->
            <div class="card mt-3">
                <div class="card-header" style="border-bottom: 3px solid #007bff">
                    <h3 class="card-title mt-1 mr-2">Post Reply</h3>
                    <a v-if="ticket?.ticketstatusid == '5'" class="btn btn-sm btn-danger ml-3" @click.prevent="closeTicket">Close Ticket</a>
                </div>
                <div class="card-body">
                    <template v-if="isClosed">
                        <span class="text-bold">This ticket is closed, so replies are disabled. If you still need assistance, feel free to open a new ticket and we’ll be happy to help.</span>
                    </template>
                    <template v-else>
                        <form id="replyForm" method="post" role="form" class="needs-validation" enctype="multipart/form-data" novalidate>
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label" for="ssh-button">Reply Content</label>
                                <div class="col-sm-10">
                                    <textarea v-model="replyBody" class="form-control form-control-sm" placeholder="Detailed post about the issue" rows="7" required></textarea>
                                    <div class="text-right text-muted" style="position: absolute; bottom: 22px; right: 25px; font-size: 12px">{{ wordCount }} / 500 words</div>
                                    <small class="text-muted">Creating separate tickets for new issues helps our team prioritize and resolve them faster.</small>
                                </div>
                                <div class="invalid-feedback">Please enter a detailed description about the issue.</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label" for="file-upload">Attach Media</label>
                                <div class="controls col-sm-10 input-group input-file w-75">
                                    <span class="input-group-btn">
                                        <button class="btn btn-secondary btn-sm btn-choose" type="button">Choose</button>
                                    </span>
                                    <input type="text" name="file_attachment" class="form-control form-control-sm input-text-file" placeholder="Choose a file..." />
                                    <span class="input-group-btn">
                                        <button class="btn btn-warning btn-reset btn-sm" type="button">Reset</button>
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div class="text-center">
                                <button class="btn btn-primary mt-2" :disabled="wordCount > 500" @click="submitReply">Post Reply</button>
                            </div>
                        </form>
                    </template>
                </div>
            </div>

            <!-- Ticket Replies -->
            <div v-if="posts.length" class="card card-widget">
                <div class="card-header">
                    <h3 class="card-title">Ticket Replies</h3>
                </div>
                <div class="card-body card-comments p-0">
                    <div v-for="post in posts" :key="post.ticketpostid" class="row m-0 card-comment card-outline card-success p-0">
                        <!-- LEFT USER COLUMN -->
                        <div class="col-md-2 username d-flex pt-4 px-3" :class="post.creator === '1' ? 'staff' : 'user'" :style="{ background: post.creator === '1' ? 'rgba(0,0,0,.03)' : '#fff', borderRight: '2px solid #ccc' }">
                            <div class="text-center mt-3 w-100">
                                <h3 class="mb-2" style="line-break: anywhere; font-size: 1.2rem">{{ post.fullname }}</h3>
                                <span class="py-1 px-2 text-sm d-block mt-1" :class="post.creator === '1' ? 'bg-green' : 'bg-secondary text-white'" style="font-weight: normal; letter-spacing: 0.6px; border-radius: 4px">
                                    {{ post.creator === '1' ? 'Staff' : post.creator === '2' ? 'User' : 'Participant' }}
                                </span>
                            </div>
                        </div>
                        <!-- RIGHT CONTENT COLUMN -->
                        <div class="col-md-10 p-0">
                            <!-- HEADER / TIMESTAMP -->
                            <div class="card-footer py-2 px-0" :class="post.creator === '1' ? 'staff' : 'user'" :style="{ borderBottom: '1px solid #ccc', background: post.creator !== '1' ? '#fff' : undefined }">
                                <span class="username ml-2 text-muted">
                                    {{ formatDate(post.dateline) }}
                                </span>
                            </div>
                            <!-- MESSAGE BODY -->
                            <div class="comment-text ml-2">
                                <div class="inherit-class w-100 m-0 js-linkify" v-html="formatReply(post.contents)" />
                                <!-- LIKE / DISLIKE -->
                                <template v-if="post.liked !== undefined">
                                    <hr class="my-1" />
                                    <div v-if="post.liked === 1" class="text-success mb-2 ml-2"><i class="fas fa-thumbs-up mr-1"></i> User liked your reply</div>
                                    <div v-else class="text-danger mb-2 ml-2"><i class="fas fa-thumbs-down mr-1"></i> User disliked your reply</div>
                                </template>
                                <!-- ATTACHMENTS -->
                                <template v-if="filesByPost[post.ticketpostid]">
                                    <div v-for="file in filesByPost[post.ticketpostid]" :key="file.attach_id" class="post-attachments">
                                        <div v-html="file.link"></div>
                                        <!-- Image modal (Bootstrap-compatible) -->
                                        <div :id="`image-${file.attach_id}`" class="attachment-modal modal fade" tabindex="-1" role="dialog">
                                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                <div class="modal-content">
                                                    <img :src="file.src" alt="Ticket Attachment" class="img-fluid" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <!-- EMAIL FOOTER (USER ONLY) -->
                            <div v-if="post.creator !== '1'" class="card-footer py-2 px-0 user" style="background: #fff">
                                <span class="ml-2"
                                    >Email: <b>{{ post.email }}</b></span
                                >
                            </div>
                        </div>
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
