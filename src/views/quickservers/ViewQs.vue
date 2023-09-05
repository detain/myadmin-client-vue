<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, moduleLink } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { useQsStore, useSiteStore } from '@/stores';
import { BuyHdSpace, BuyIp, ChangeHostname, ChangeRootPassword, ChangeTimezone, ChangeWebuzoPassword, InsertCd, ReinstallOs, ResetPassword, ReverseDns, Slices, TrafficUsage, Vnc } from '@/views/vps';
import $ from 'jquery';
const module = 'quickservers';
const siteStore = useSiteStore();
const route = useRoute();
const id = Number(route.params.id);
const link = computed(() => { return route.params.link as string; });
const { modules } = storeToRefs(siteStore);
const settings = computed(() => { return modules.value[module]; });
siteStore.setPageHeading('View Qs');
siteStore.setTitle('View Qs');
siteStore.setBreadcrums([[ '/home', 'Home'],[ '/'+moduleLink(module)+'/', 'Rapid Deploy Servers' ]]);
siteStore.addBreadcrum('/'+moduleLink(module)+'/' + id, 'View Qs ' + id);

const qsStore = useQsStore();
const { loading, error, pkg, linkDisplay, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceMaster, osTemplate, serviceExtra, extraInfoTables, cpu_graph_data, bandwidth_xaxis, bandwidth_yaxis, token, service_disk_used, service_disk_total, disk_percentage, memory, hdd, serviceOverviewExtra } = storeToRefs(qsStore);

qsStore.getById(id);

const isCollapsed = ref(false);

const diskPercentage = Math.round((serviceMaster.value.qs_hdfree / serviceMaster.value.qs_hdsize) * 100);

function openCommentForm() {

}

function submitComment() {

}

function closeModal() {

}
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-2">
                    <h3>Package</h3>
                    <p class="m-0 py-1">{{ pkg }}</p>
                    <p class="m-0">
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">
                    <b>{{ serviceInfo.qs_hostname }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div
                :class="{
                    'small-box': true,
                    'bg-success': serviceInfo.qs_status === 'active',
                    'bg-warning text-white': serviceInfo.qs_status === 'pending',
                    'bg-danger': serviceInfo.qs_status !== 'active' && serviceInfo.qs_status !== 'pending',
                }">
                <div class="inner px-3 pb-1 pt-2">
                    <h3>Billing</h3>
                    <p class="m-0 py-1">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                    <p class="m-0">
                        Payment Status: <b>{{ billingDetails.service_payment_status }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="small-box-footer">
                    Status is: <b>{{ serviceInfo.qs_status }}</b>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>
                        Host Server: <b>{{ serviceMaster.qs_name }}</b>
                    </h3>
                    <p class="my-2 py-2">
                        IP is: <b>{{ serviceInfo.qs_ip }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="small-box-footer">
                    Vzid: <b>{{ serviceInfo.qs_vzid }}</b>
                </div>
            </div>
        </div>
    </div>
    <div v-if="link" class="row">
        <div v-if="link == 'buy_hd_space'" class="col">
            <BuyHdSpace :id="id" :module="module"></BuyHdSpace>
        </div>
        <div v-else-if="link == 'buy_ip'" class="col">
            <BuyIp :id="id" :module="module"></BuyIp>
        </div>
        <div v-else-if="link == 'change_hostname'" class="col">
            <ChangeHostname :id="id" :module="module"></ChangeHostname>
        </div>
        <div v-else-if="link == 'change_root_password'" class="col">
            <ChangeRootPassword :id="id" :module="module"></ChangeRootPassword>
        </div>
        <div v-else-if="link == 'change_timezone'" class="col">
            <ChangeTimezone :id="id" :module="module"></ChangeTimezone>
        </div>
        <div v-else-if="link == 'change_webuzo_password'" class="col">
            <ChangeWebuzoPassword :id="id" :module="module"></ChangeWebuzoPassword>
        </div>
        <div v-else-if="link == 'insert_cd'" class="col">
            <InsertCd :id="id" :module="module"></InsertCd>
        </div>
        <div v-else-if="link == 'reinstall_os'" class="col">
            <ReinstallOs :id="id" :module="module"></ReinstallOs>
        </div>
        <div v-else-if="link == 'reset_password'" class="col">
            <ResetPassword :id="id" :module="module"></ResetPassword>
        </div>
        <div v-else-if="link == 'reverse_dns'" class="col">
            <ReverseDns :id="id" :module="module"></ReverseDns>
        </div>
        <div v-else-if="link == 'slices'" class="col">
            <Slices :id="id" :module="module"></Slices>
        </div>
        <div v-else-if="link == 'traffic_usage'" class="col">
            <TrafficUsage :id="id" :module="module"></TrafficUsage>
        </div>
        <div v-else-if="link == 'vnc'" class="col">
            <Vnc :id="id" :module="module"></Vnc>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <template v-if="!link || (link && ['cancel', 'welcome_email'].includes(link))">
        <div class="row my-2">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-server">&nbsp;</i>&nbsp;QuickServer Information</h3>
                            <div class="card-tools float-right pl-3 pt-1">
                                <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="text-md m-0 p-2 text-center">
                                    Power Status is:
                                    <span
                                        :class="{
                                            'text-success': serviceInfo.qs_server_status === 'running',
                                            'text-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                                            'text-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                            'text-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                        }">
                                        {{ serviceInfo.qs_server_status }}
                                    </span>
                                </h5>
                            </div>
                            <div class="col-md-12 mr-3 pr-4 pt-2 text-center">
                                <div class="btn-group">
                                    <button
                                        type="button"
                                        :class="{
                                            'btn-success': serviceInfo.qs_server_status === 'running',
                                            'btn-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                                            'btn-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                            'btn-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                        }">
                                        Select Action
                                    </button>
                                    <button
                                        type="button"
                                        :class="{
                                            'btn-success': serviceInfo.qs_server_status === 'running',
                                            'btn-warning': ['Paused', 'suspended'].includes(serviceInfo.qs_server_status),
                                            'btn-danger': ['stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                            'btn-info': !['running', 'Paused', 'suspended', 'stopped', 'deleted', 'shut'].includes(serviceInfo.qs_server_status),
                                        }"
                                        class="dropdown-toggle dropdown-hover dropdown-icon"
                                        data-toggle="dropdown">
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div class="dropdown-menu" role="menu">
                                        <router-link :to="'/'+moduleLink(module)+'/' + serviceInfo.qs_id + '/start'" class="dropdown-item">Start</router-link>
                                        <router-link :to="'/'+moduleLink(module)+'/' + serviceInfo.qs_id + '/restart'" class="dropdown-item">Restart</router-link>
                                        <router-link :to="'/'+moduleLink(module)+'/' + serviceInfo.qs_id + '/stop'" class="dropdown-item">Stop</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12 py-2">
                                <span class="info-box-text">
                                    <hr />
                                    <h5 class="mt-5 text-center">
                                        Comment:
                                        <span v-if="serviceInfo.qs_comment">{{ serviceInfo.qs_comment }}</span>
                                        <span v-else>none</span>
                                        <span @click="openCommentForm" title="Edit Comment" style="cursor: pointer"><i class="fa fa-pencil my-2 text-sm"></i></span>
                                    </h5>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="service_disk_total" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-hdd">&nbsp;</i>Disk</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body pt-0" :style="{ height: '270px' }">
                        <div class="row">
                            <div class="col-md-12 mb-1 py-3">
                                <table class="table-bordered my-3 table">
                                    <tr>
                                        <td class="text-muted text-bold">Total Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdsize }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Free Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdfree }}</td>
                                    </tr>
                                    <tr>
                                        <td class="text-muted text-bold">Remaining Space:</td>
                                        <td class="text-bold text-capitalize">{{ serviceMaster.qs_hdsize - serviceMaster.qs_hdfree }} GB</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 75%">
                                            <div id="info-progress-lg" class="progress progress-sm mt-2">
                                                <div class="progress-bar" :class="[{ 'bg-gradient-blue': diskPercentage <= 80 }, { 'bg-gradient-yellow': 80 > diskPercentage && diskPercentage <= 90 }, { 'bg-gradient-red': diskPercentage > 90 }]" :style="{ width: diskPercentage + '%' }"></div>
                                            </div>
                                        </td>
                                        <td class="text-bold text-capitalize text-md" style="vertical-align: middle">{{ diskPercentage }}%</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="serviceOverviewExtra" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Connections</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px">
                        <table class="table-bordered table">
                            <tr>
                                <td><b>VNC Info</b></td>
                                <td>
                                    <template v-if="serviceOverviewExtra.vnc_information">
                                        <b class="text-muted">{{ serviceOverviewExtra.vnc_information }}</b>
                                    </template>
                                    <template v-else>
                                        <b class="text-muted font-italic">No data to show</b>
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Spice Info</b></td>
                                <td>
                                    <template v-if="serviceOverviewExtra.spice_information">
                                        <b class="text-muted">{{ serviceOverviewExtra.spice_information }}</b>
                                    </template>
                                    <template v-else>
                                        <b class="text-muted font-italic">No data to show</b>
                                    </template>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="osTemplate" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-microchip">&nbsp;</i>System Information</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" style="height: 270px">
                        <table class="table-bordered table">
                            <tr>
                                <td><b>OS</b></td>
                                <td>
                                    <b class="text-muted">{{ osTemplate }}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/'+moduleLink(module)+'/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                            <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                            >{{ clientLink.label }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <template v-if="extraInfoTables.ip_info">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-map-marker-alt">&nbsp;</i>IP Information</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table-bordered table">
                                <tr v-for="(itemvalue, index) in extraInfoTables.ip_info.rows" :key="index">
                                    <td>
                                        <b>{{ itemvalue.desc }}</b>
                                    </td>
                                    <td>
                                        <b class="text-muted">{{ itemvalue.value }}</b>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="extraInfoTables.cp">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-header">
                            <div class="p-1">
                                <h3 class="card-title py-2"><i class="fa fa-tachometer-alt">&nbsp;</i>{{ extraInfoTables.cp.title }}</h3>
                                <div class="card-tools float-right">
                                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table-bordered table">
                                <tr v-for="(itemvalue, index) in extraInfoTables.cp.rows" :key="index">
                                    <td>
                                        <b>{{ itemvalue.desc }}</b>
                                    </td>
                                    <td>
                                        <b class="text-muted">{{ itemvalue.value }}</b>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
            <div v-if="extraInfoTables.addons" class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-plus">&nbsp;</i>
                                {{ extraInfoTables.addons.title }}
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table-bordered table">
                            <tr v-for="(itemvalue, index) in extraInfoTables.addons.rows" :key="index">
                                <td>
                                    <b>{{ itemvalue.desc }}</b>
                                </td>
                                <td>
                                    <b class="text-muted">{{ itemvalue.value }}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.note" class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-exclamation">&nbsp;</i>
                                {{ extraInfoTables.note.title }}
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table-bordered table">
                            {{
                                extraInfoTables.note.rows[0].value
                            }}
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form class="inline" @submit.prevent="submitComment">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <input type="hidden" name="id" :value="serviceInfo.qs_id" />
                            <input type="hidden" name="link" value="update_comment" />
                                <input type="hidden" name="edit_comment" value="2" />
                            <div class="form-group">
                                <label for="message-text" class="col-form-label">Comment:</label>
                                <textarea class="form-control" id="message-text" rows="5" name="comment" v-model="serviceInfo.qs_comment"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
