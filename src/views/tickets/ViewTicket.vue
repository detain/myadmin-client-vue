<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '../../stores/tickets.store';
import { ref, computed, nextTick } from 'vue';
//import Prism from 'prismjs';
import $ from 'jquery';
//import from '/lib/select2/dist/js/select2.full.min.js';
const ticketsStore = useTicketsStore();
const showToggle = ref(false);
const inputFile = ref('');
const { ticket, loading, error, ima, custid, sortcol, sortdir, st_count, offset, totalTickets, limit, currentPage, pages, view, search } = storeToRefs(ticketsStore);

/*
function toggleToggle() {
    showToggle.value = !showToggle.value;
}

function chooseFile() {
    inputFile.value.click();
}

function resetFile() {
    inputFile.value = null;
    inputFile.value.previousSibling.value = '';
}
*/

$(function () {
    $('.ssh-toggle').hide();
    bs_input_file();
    //Initialize Select2 Elements
    //$('.select2').select2();
    //Initialize Select2 Elements
    //$('.select2bs4').select2({ theme: 'bootstrap4', });
});

function bs_input_file() {
    /*
    $('.input-file').after(function () {
        if (!$(this).prev().hasClass('input-ghost')) {
          const element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0'>");
          element.attr('name', $(this).attr('name') as string);
            element.change(function () {
                element.prev().find('input').val((element.val() as string).split('\\').pop() as string);
            });
            $(this)
                .find('button.btn-choose')
                .click(function () {
                    element.click();
                });
            $(this)
                .find('button.btn-reset')
                .click(function () {
                    element.val('');
                    $(this).parents('.input-file').find('input').val('');
                });
            $(this).find('input').css('cursor', 'pointer');
            $(this)
                .find('input')
                .mousedown(function () {
                    $(this).parents('.input-file').next().click();
                    return false;
                });
            return element;
        }
    });
    */
}

interface Ticket {
    ticketstatustitle: string;
    dateline: number;
    lastactivity: number;
    subject: string;
    ticketstatusid: number;
}

const props = defineProps<{
    ticket: Ticket;
    posts: any[];
    statusCounts: any[];
    suppressedEmail?: { email: string };
}>();

const searchQuery = ref('');
const searchResults = ref<any[]>([]);

const serverAccess = ref(false);
const server = ref({
    ip: '',
    rootPass: '',
    isRootRestricted: false,
    sudoUser: '',
    sudoPass: '',
    port: 22,
});

const replyBody = ref('');
const wordCount = ref(0);
const replyFile = ref<File | null>(null);

const statusClass = computed(() => ({
    'bg-success': props.ticket.ticketstatustitle === 'Open',
    'bg-warning': props.ticket.ticketstatustitle === 'On Hold',
    'bg-secondary': props.ticket.ticketstatustitle === 'In Progress',
    'bg-danger': props.ticket.ticketstatustitle === 'Closed',
}));

const statusIcon = computed(() => (props.ticket.ticketstatustitle === 'In Progress' ? 'fas fa-hourglass-half' : 'fas fa-ticket-alt'));

const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

const updateWordCount = () => {
    const words = replyBody.value.trim().split(/\s+/);
    wordCount.value = Math.min(words.length, 500);
    replyBody.value = words.slice(0, 500).join(' ');
};

const handleReplyFile = (e: Event) => {
    replyFile.value = (e.target as HTMLInputElement).files?.[0] || null;
};

const postReply = async () => {
    const formData = new FormData();
    formData.append('body', replyBody.value);
    if (replyFile.value) formData.append('file', replyFile.value);
};

const updateTicket = () => {};
const closeTicket = () => {};

const searchTickets = async () => {
    searchResults.value = [];
};

const renderPost = (content: string) => {
    const escaped = content.replace(/\n/g, '<br>');
    //  nextTick(() => Prism.highlightAll());
    return escaped;
};
</script>

<template>
    <template v-if="ticket">
        <div class="row mb-4">
            <!-- Status -->
            <div class="col-md-2 pr-1">
                <div class="info-box p-0">
                    <span class="info-box-icon border-rad-zero" :class="statusClass">
                        <i :class="statusIcon"></i>
                    </span>
                    <div class="info-box-content">
                        <span class="info-box-number">{{ ticket.ticketstatustitle }}</span>
                        <span class="info-box-text"> Created: {{ formatDate(ticket.dateline) }} </span>
                        <span class="info-box-text"> Updated: {{ formatDate(ticket.lastactivity) }} </span>
                    </div>
                </div>
            </div>

            <!-- Subject -->
            <div class="col-md-10">
                <div class="callout callout-info m-0 py-3">
                    <h5>
                        <b><i class="fas fa-align-left"></i> Subject</b>
                    </h5>
                    <p>{{ ticket.subject }}</p>
                </div>
            </div>
        </div>

        <!-- Suppressed Email -->
        <div v-if="suppressedEmail" class="alert alert-danger">
            <strong>Important Notice:</strong>
            Your email <b>{{ suppressedEmail.email }}</b> is disabled.
        </div>

        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2">
                <div class="card mb-3">
                    <div class="input-group input-group-sm">
                        <input v-model="searchQuery" class="form-control" placeholder="Search by TicketID / Subject" />
                        <button class="btn btn-primary" @click="searchTickets">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>

                    <div v-if="searchResults.length" class="results p-2">
                        <div v-for="r in searchResults" :key="r.id">
                            {{ r.subject }}
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Quick Filter</h3>
                    </div>
                    <ul class="nav nav-pills flex-column">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/new-ticket"> <i class="fa fa-plus-circle"></i> New Ticket </RouterLink>
                        </li>
                        <li v-for="st in statusCounts" :key="st.ticketstatustitle" class="nav-item">
                            <RouterLink class="nav-link" :to="`/tickets?view=${st.ticketstatustitle}`">
                                {{ st.ticketstatustitle }}
                                <span class="badge ml-1">{{ st.st_count }}</span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Main -->
            <div class="col-md-10">
                <!-- Server Access -->
                <div class="card card-body">
                    <div class="custom-control custom-checkbox">
                        <input v-model="serverAccess" type="checkbox" class="custom-control-input" />
                        <label class="custom-control-label"> Allow InterServer to modify server </label>
                    </div>

                    <div v-if="serverAccess" class="mt-3">
                        <div class="form-row">
                            <div class="col-md-2">
                                <label>IP Address</label>
                                <input v-model="server.ip" class="form-control form-control-sm" />
                            </div>
                            <div class="col-md-2">
                                <label>Root Password</label>
                                <input v-model="server.rootPass" class="form-control form-control-sm" />
                            </div>
                            <div class="col-md-2">
                                <input v-model="server.isRootRestricted" type="checkbox" />
                                Is SSH Root Restricted?
                            </div>

                            <template v-if="server.isRootRestricted">
                                <div class="col-md-2">
                                    <label>Sudo User</label>
                                    <input v-model="server.sudoUser" class="form-control form-control-sm" />
                                </div>
                                <div class="col-md-2">
                                    <label>Sudo Password</label>
                                    <input v-model="server.sudoPass" class="form-control form-control-sm" />
                                </div>
                                <div class="col-md-2">
                                    <label>SSH Port</label>
                                    <input v-model="server.port" class="form-control form-control-sm" />
                                </div>
                            </template>
                        </div>
                    </div>

                    <div class="text-center mt-3">
                        <button class="btn btn-outline-primary" @click="updateTicket">Update</button>
                    </div>
                </div>

                <!-- Reply -->
                <div class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Post Reply</h3>
                        <button v-if="ticket.ticketstatusid === 5" class="btn btn-sm btn-danger ml-3" @click="closeTicket">Close Ticket</button>
                    </div>

                    <div class="card-body">
                        <textarea v-model="replyBody" class="form-control" rows="7" @input="updateWordCount" />
                        <div id="wordCount">{{ wordCount }} / 500 words</div>

                        <input type="file" @change="handleReplyFile" />

                        <div class="text-center mt-3">
                            <button class="btn btn-primary" @click="postReply">Post Reply</button>
                        </div>
                    </div>
                </div>

                <!-- Replies -->
                <div v-if="posts.length" class="card mt-3">
                    <div class="card-header">
                        <h3 class="card-title">Ticket Replies</h3>
                    </div>

                    <div class="card-body">
                        <div v-for="post in posts" :key="post.ticketpostid" class="mb-4">
                            <h5>{{ post.fullname }}</h5>
                            <small>{{ formatDate(post.dateline) }}</small>

                            <div class="inherit-class" v-html="renderPost(post.contents)"></div>

                            <div v-if="post.liked === 1" class="text-success"><i class="fas fa-thumbs-up"></i> User liked your reply</div>
                            <div v-if="post.liked === 0" class="text-danger"><i class="fas fa-thumbs-down"></i> User disliked your reply</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
.results {
    max-height: 200px;
    overflow-y: auto;
}
</style>
