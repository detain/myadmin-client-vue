<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '@/stores';
import { ref, computed } from 'vue';
import $ from 'jquery';
//import from '/lib/select2/dist/js/select2.full.min.js';
const ticketsStore = useTicketsStore();
const showToggle = ref(false);
const inputFile  = ref('');
const success    = ref<string | boolean>(false);
const failed     = ref<string | boolean>(false);
const { ticket, loading, error, ima, custid, sortcol, sortdir, countArray, inboxCount, rowsOffset, rowsTotal, limit, currentPage, pages, view, viewText, search } = storeToRefs(ticketsStore);

function formatDate(date: string) {

}

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

$(document).ready(function () {
    $('.ssh-toggle').hide();
    bs_input_file();
    //Initialize Select2 Elements
    $('.select2').select2();

    //Initialize Select2 Elements
    $('.select2bs4').select2({
        theme: 'bootstrap4',
    });
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
</script>

<template>
    <div v-if="success" class="row">
        <div class="alert alert-success mainbox col-md-12" style="padding: 5px">{{ success }}</div>
    </div>
    <div v-if="failed" class="row">
        <div class="alert alert-danger mainbox col-md-12" style="padding: 5px">{{ failed }}</div>
    </div>
    <template v-else>
    <link     rel         = "stylesheet" href                      = "/lib/select2/dist/css/select2.min.css" />
    <link     rel         = "stylesheet" href                      = "/lib/select2-bootstrap-theme/dist/select2-bootstrap.min.css" />
    <div      class       = "row">
    <div      class       = "col-md-3">
    <div      class       = "info-box p-0">
    <span     class       = "info-box-icon border-rad-zero" :class = "{ 'bg-success': ticket.status === 'Open', 'bg-warning': ticket.status === 'On Hold', 'bg-danger': ticket.status !== 'Open' && ticket.status !== 'On Hold' }"><i class = "fas fa-ticket-alt"></i></span>
    <div      class       = "info-box-content">
    <!--      <span class = "info-box-text">{{ ticket.ticketmaskid }}</span> -->
    <span     class       = "info-box-number">{{ ticket.status }}</span>
    <span     class       = "info-box-text">{{ ticket.priority }}</span>
    <span     class       = "info-box-text">{{ ticket.department }} Department</span>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div class="callout callout-info">
                    <h5><i class="fas fa-align-left">&nbsp;</i>Subject</h5>
                    <p>{{ ticket.subject }}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <form method="POST" action="view_ticket?ticket={$ticket.ticketid}">
                    <div class="card card-outline card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Update Ticket</h3>
                            <!-- /.user-block -->
                            <div class="card-tools">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-group row">
                                <label for="status" class="col-sm-4 col-form-label">Status</label>
                                <div class="col-sm-8">
                                    <select name="status" class="form-control form-control-sm select2" style="width: 100%">
                                        <option value="4" selected>Open</option>
                                        <option value="5">On Hold</option>
                                        <option value="6">Close</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="box_auth_value" class="col-sm-4 col-form-label">Root Password</label>
                                <div class="col-sm-8">
                                    <input type="password" name="box_auth_value" class="form-control form-control-sm" placeholder="Root password (VPS / Dedicated Server)" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="user_ip" class="col-sm-4 col-form-label">Your IP Address</label>
                                <div class="col-sm-8">
                                    <input type="text" name="user_ip" class="form-control form-control-sm" placeholder="Your IP Address" value="{$client_ip}" />
                                    <span class="help-text text-orange">If connection is coming from different IP address. Kindly change it.</span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="" class="col-sm-4 col-form-label">Is SSH root restricted ?</label>
                                <div class="col-sm-8"><button class="ssh-root btn btn-secondary btn-sm" @click.prevent="$('.ssh-toggle').toggle();">Click here</button></div>
                            </div>
                            <div class="form-group row ssh-toggle">
                                <label for="sudo_user" class="col-sm-4 col-form-label">Sudo User</label>
                                <div class="col-sm-8"><input type="text" name="sudo_user" class="form-control form-control-sm" placeholder="Sudo Username" /></div>
                            </div>
                            <div class="form-group row ssh-toggle">
                                <label for="sudo_password" class="col-sm-4 col-form-label">Sudo Password</label>
                                <div class="col-sm-8">
                                    <input type="text" name="sudo_password" class="form-control form-control-sm" placeholder="Sudo user password" />
                                    <span class="help-text text-orange">Passwords are stored in a separate encrypted database.</span>
                                </div>
                            </div>
                            <div class="form-group row ssh-toggle">
                                <label for="port_no" class="col-sm-4 col-form-label">SSH Port</label>
                                <div class="col-sm-8"><input type="text" name="port_no" class="form-control form-control-sm" placeholder="SSH Port Number" value="22" /></div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <button type="submit" name="submit" value="updateTicket" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-md-6">
                <form method="post" role="form" action="view_ticket?ticket={$ticket.ticketid}" enctype="multipart/form-data">
                    <div class="card card-outline card-primary">
                        <div class="card-header">
                            <h3 class="card-title">Reply Post</h3>
                            <!-- /.user-block -->
                            <div class="card-tools">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-group row">
                                <label for="inputEmail3" class="col-sm-2 col-form-label">Post</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control form-control-sm" name="body" placeholder="Detailed post about the issue" rows="7"></textarea>
                                </div>
                            </div>
                            <div class="form-group required row mb-0">
                                <label for="file_upload" class="col-sm-2 col-form-label requiredField">File Upload</label>
                                <div class="controls col-sm-10 input-group input-file" name="file_attachment">
                                    <span class="input-group-btn">
                                        <button class="btn btn-secondary btn-sm btn-choose" type="button">Choose</button>
                                    </span>
                                    <input type="text" name="file_attachment" v-model="inputFile" class="form-control form-control-sm input-text-file" placeholder="Choose a file..." />
                                    <span class="input-group-btn">
                                        <button class="btn btn-warning btn-reset btn-sm" type="button">Reset</button>
                                    </span>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="ff" class="col-md-2"></label>
                                <div class="col-sm-10 input-group">
                                    <span class="help-text text-orange">Note: Only image files - gif/jpeg/png types are allowed.</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <button type="submit" name="submit" value="postReply" class="btn btn-primary">Post Reply</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="card card-widget card-outline card-success">
                    <div class="card-header">
                        <h3 class="card-title">Ticket Replies</h3>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-footer card-comments">
                        <div v-if="ticket.ticket_posts">
                            <div v-for="post in ticket.ticket_posts" :key="post.id" class="card-comment">
                                <div class="comment-text ml-4">
                                    <span class="username">
                                        {{ post.fullname }} <span :class="post.staffid ? 'b-radius bg-green ml-1 px-2 py-1 text-xs' : 'b-radius bg-green ml-1 px-2 py-1 text-xs'"> {{ post.staffid ? 'Staff' : 'User' }}</span>
                                        <span class="text-muted float-right">{{ formatDate(post.posted_on) }}</span>
                                    </span>
                                    <pre class="inherit-class">{{ post.contents }}</pre>
                                    <template v-if="post.liked !== undefined">
                                        <button type="button" class="btn btn-secondary btn-sm bg-primary"><i :class="post.liked == 1 ? 'far fa-thumbs-up' : 'far fa-thumbs-down'"></i> {{ post.liked == 1 ? 'Like' : 'Dislike' }}</button>
                                    </template>
                                    <template v-if="post.attachment_count > 0 && post.getAttachments">
                                        <span v-for="attachment in post.getAttachments" :key="attachment.id">{{ attachment.file }}&nbsp;</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped>
.inherit-class {
    display: inherit;
    font-family: inherit;
    font-size: inherit;
    white-space: pre-wrap;
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: inherit !important;
    margin-top: -5px;
}

.select2-container .select2-selection--single .select2-selection__rendered {
    padding-left: 0 !important;
}

.info-box {
    box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%);
    border-radius: 0.25rem;
    background-color: #fff;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 1rem;
    min-height: 80px;
    padding: 0.5rem;
    position: relative;
    width: 100%;
}

.info-box .info-box-icon {
    border-radius: 0.25rem;
    -ms-flex-align: center;
    align-items: center;
    display: -ms-flexbox;
    display: flex;
    font-size: 1.875rem;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
    width: 70px;
}
</style>
