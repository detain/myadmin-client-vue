<script setup>
import { ref, computed, onMounted } from "vue";

const countArray = {
    'Open': ref(0),
    'On Hold': ref(0),
    'Closed': ref(0),
};
const view_text = ref("");
const tickets = ref([]);
const rows_offset = ref(0);
const rows_total = ref(0);
const limit = ref(0);
const current_page = ref(0);
const pages = ref(0);
const view = ref("");
const search = ref("");

const statusText = computed(() => {
    if (view_text) {
        switch (view_text) {
            case "open":
                return "Open";
            case "hold":
                return "Awaiting Reply";
            case "closed":
                return "Closed";
            default:
                return "Inbox";
        }
    } else {
        return "Inbox";
    }
});
</script>

<template>
<div class="row">
    <div class="col-md-2">
        <a href="new_ticket" class="btn btn-primary btn-block mb-3">New Ticket</a>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Folders</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                </div>
            </div>
            <div class="card-body p-0">
                <ul class="nav nav-pills flex-column">
                    <li class="nav-item active">
                        <a href="tickets_list" class="nav-link">
                            <i class="fas fa-inbox text-primary">&nbsp;</i> Inbox
                            <!-- <span class="badge bg-primary float-right">{{ inboxCount }}</span> -->
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="tickets_list?view=open" class="nav-link">
                            <i class="far fa-envelope-open text-success">&nbsp;</i> Open
                            <span class="badge bg-success float-right">{{ countArray['Open'] }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="tickets_list?view=hold" class="nav-link">
                            <i class="fa fa-pause text-warning">&nbsp;</i> Awaiting Reply
                            <span class="badge bg-warning float-right">{{ countArray['On Hold'] }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="tickets_list?view=closed" class="nav-link">
                            <i class="far fa-envelope text-danger">&nbsp;</i> Closed
                            <span class="badge bg-danger float-right">{{ countArray['Closed'] }}</span>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- /.card-body -->
        </div>
    </div>
    <!-- /.col -->
    <div class="col-md-10">
        <form method="POST">
            <div class="card card-primary card-outline">
                <div class="card-header">
                    <h3 class="card-title">{{ statusText }}</h3>
                    <div class="card-tools" style="width: 40%;">
                        <form method="POST" action="">
                            <div class="input-group input-group-sm">
                                <input v-model="search" type="text" name="search" class="form-control" placeholder="Search by TicketID / Subject / Content">
                                <div class="input-group-append">
                                    <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i></button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- /.card-tools -->
                </div>
                <!-- /.card-header -->
                <div class="card-body p-0">
                    <template v-if="tickets.length">
                        <div class="mailbox-controls">
                            <!-- Check all button -->
                            <button type="button" class="btn btn-secondary btn-sm checkbox-toggle"><i class="far fa-square"></i></button>
                            <div class="btn-group">
                                <button id="close-ticket" type="submit" class="btn btn-danger btn-sm" value="Close" title="Close Tickets" data-toggle="tooltip" tooltip="Close Tickets"><i class="far fa-envelope"></i></button>
                            </div>
                            <div class="float-right">
                                {{ rowsOffset + 1 }}-{{ !search || rowsOffset + limit < rowsTotal ? rowsOffset + limit : rowsTotal }}/{{ rowsTotal }}
                                <div class="btn-group">
                                    <button v-if="current_page - 1 < 1" type="button" class="btn btn-secondary btn-sm"><i class="fas fa-chevron-left"></i></button>
                                    <a v-else class="btn btn-secondary btn-sm" :href="'index.php?choice=none.tickets_list&amp;view=' + view + '&amp;page=' + (current_page - 1) + '&amp;limit=' + limit"><i class="fas fa-chevron-left"></i></a>
                                    <button v-if="current_page + 1 > pages" type="button" class="btn btn-secondary btn-sm"><i class="fas fa-chevron-right"></i></button>
                                    <a v-else class="btn btn-secondary btn-sm" :href="'index.php?choice=none.tickets_list&amp;view=' + view + '&amp;page=' + current_page + 1 + '&amp;limit=' + limit"><i class="fas fa-chevron-right"></i></a>
                                </div>
                                <!-- /.btn-group -->
                            </div>
                            <!-- /.float-right -->
                        </div>
                        <div class="table-responsive mailbox-messages">
                            <table>
                                <tbody>
                                    <tr v-for="ticket in tickets" :key="ticket.ticketid">
                                        <td>
                                            <div class="icheck-primary" v-if="ticket.can_close === 'no'">
                                                <input type="checkbox" value="1" :id="'check'+ticket.ticketid" :name="`tickets[${ticket.ticketid}]`">
                                                <label :for="'check'+ticket.ticketid"></label>
                                            </div>
                                        </td>
                                        <td class="mailbox-star">
                                            <i v-if="ticket.status_text === 'Open'" class="far fa-envelope-open text-success"></i>
                                            <i v-else-if="ticket.status_text === 'On Hold'" class="fa fa-pause text-warning"></i>
                                            <i v-else-if="ticket.status_text === 'Closed'" class="far fa-envelope text-danger"></i>
                                        </td>
                                        <td class="mailbox-name">{{ ticket.lastreplier }}</td>
                                        <td class="mailbox-subject">
                                            <b>{{ ticket.ticketmaskid }}</b> - {{ ticket.title.length > 140 ? ticket.title.substring(0, 140 - 3) + "..." : ticket.title }}
                                        </td>
                                        <td class="mailbox-attachment" v-if="ticket.attachments.length > 0"><i class="fas fa-paperclip"></i></td>
                                        <td class="mailbox-date">{{ ticket.lastactivity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- /.mail-box-messages -->
                    </template>
                    <h4 v-else class="p-4">No tickets found!</h4>
                </div>
                <!-- /.card-body -->
                <div class="card-footer p-0">
                    <div v-if="tickets.length" class="mailbox-controls">
                        <!-- Check all button -->
                        <button type="button" class="btn btn-secondary btn-sm checkbox-toggle"><i class="far fa-square"></i>
                        </button>
                        <div class="btn-group">
                            <button id="close-ticket-footer" type="submit" class="btn btn-danger btn-sm" value="Close" title="Close Tickets" data-toggle="tooltip" tooltip="Close Tickets"><i class="far fa-envelope"></i></button>
                        </div>
                        <div class="float-right">
                            {{ rowsOffset + 1 }}-{{ !search || rowsOffset + limit < rowsTotal ? rowsOffset + limit : rowsTotal }}/{{ rowsTotal }}
                            <div class="btn-group">
                                <button v-if="current_page - 1 < 1" type="button" class="btn btn-secondary btn-sm"><i class="fas fa-chevron-left"></i></button>
                                <a v-else class="btn btn-secondary btn-sm" :href="'index.php?choice=none.tickets_list&amp;view=' + view + '&amp;page=' + (current_page - 1) + '&amp;limit=' + limit"><i class="fas fa-chevron-left"></i></a>
                                <button v-if="current_page + 1 > pages" type="button" class="btn btn-secondary btn-sm"><i class="fas fa-chevron-right"></i></button>
                                <a v-else class="btn btn-secondary btn-sm" :href="'index.php?choice=none.tickets_list&amp;view=' + view + '&amp;page=' + (current_page + 1) + '&amp;limit=' + limit"><i class="fas fa-chevron-right"></i></a>
                            </div>
                            <!-- /.btn-group -->
                        </div>
                        <!-- /.float-right -->
                    </div>
                </div>
            </div>
            <!-- /.card -->
        </form>
    </div>
    <!-- /.col -->
</div>
<!-- /.row -->
</template>

<style scoped>
  a.btn {
    color: inherit !important;
  }
</style>
