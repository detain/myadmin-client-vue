<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { useFloatingIpStore } from '@/stores/floating_ips.store';
import { useSiteStore } from '@/stores/site.store';
import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import ChangeIp from './ChangeIp.vue';
import Swal from 'sweetalert2';

const module = 'floating_ips';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const floatingIpStore = useFloatingIpStore();
const id = Number(route.params.id);
const link = computed(() => route.params.link);
const { modules } = storeToRefs(siteStore);
const { loading, error, pkg, linkDisplay, serviceInfo, titleField, titleField2, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, usage_count } = storeToRefs(floatingIpStore);
const settings = computed(() => modules.value[module]);
siteStore.setPageHeading('View Floating IPs');
siteStore.setTitle('View Floating IPs');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module)}`, 'Floating IPs'],
]);
siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, `View Floating IPs ${serviceInfo.value.floating_ip_ip}`);

function submitForm() {}

function closeModal() {}

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        [`/${moduleLink(module)}`, 'Floating IPs'],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, `View Floating IP ${serviceInfo.value.floating_ip_ip}`);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(`View Floating IP ${serviceInfo.value.floating_ip_ip}`);
        siteStore.setTitle(`View Floating IP ${serviceInfo.value.floating_ip_ip}`);
    } else {
        siteStore.setPageHeading(`Floating IP ${serviceInfo.value.floating_ip_ip} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.setTitle(`Floating IP ${serviceInfo.value.floating_ip_ip} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.addBreadcrum(`/${moduleLink(module)}/${id}/${newLink}`, ucwords(newLink.replace('_', ' ')));
        if (newLink == 'welcome_email') {
            Swal.fire({
                icon: 'question',
                title: '<h3>Are you sure?</h3> ',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes',
                html: 'Are you sure want to resend welcome email?',
                preConfirm: () => {
                    try {
                        Swal.close();
                        fetchWrapper.get(`/${moduleLink(module)}/${id}/welcome_email`).then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: '<h3>Email Sent</h3> ',
                                showCancelButton: false,
                                showLoaderOnConfirm: true,
                                confirmButtonText: 'Yes',
                                html: 'The welcome email has been resent.  Check your inbox.',
                                preConfirm: () => {
                                    router.push(`/${moduleLink(module)}/${id}`);
                                },
                            });
                        });
                    } catch (error: any) {
                        console.log('error', error);
                    }
                },
            });
        } else if (newLink == 'login') {
            // do something here
        }
    }
}

watch(
    () => route.params.link,
    (newLink) => {
        loadLink(newLink as string);
    }
);

loadLink(route.params.link as string);

floatingIpStore.getById(id);

const status = computed(() => serviceInfo.value.floating_ip_status); // compute your status value here
const statusClass = computed(() => {
    const statusValue = serviceInfo.value.floating_ip_status;
    if (statusValue === 'active') return 'small-box b-radius bg-success';
    if (statusValue === 'pending') return 'small-box b-radius bg-orange';
    if (statusValue === 'expired' || statusValue === 'canceled') return 'small-box b-radius bg-red';
    return '';
});
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-4">
            <div class="small-box bg-secondary b-radius">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Package</h3>
                    <p class="m-0 py-2">{{ pkg }}</p>
                    <p>
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-briefcase"></i></div>
                <span class="small-box-footer text-bold">{{ serviceInfo.floating_ip_ip }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="statusClass">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Billing</h3>
                    <p class="my-3 py-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b> billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon"><i class="fas fa-dollar-sign"></i></div>
                <span class="small-box-footer"
                    >Floating IPs Status is: <b>{{ status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Floating IP</h3>
                    <p class="py-3 my-3">
                        Floating IP is: <b>{{ serviceInfo.floating_ip_ip }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <span class="small-box-footer">
                    Target IP: <b>{{ serviceInfo.floating_ip_target_ip }}</b>
                </span>
            </div>
        </div>
    </div>
    <template v-if="link">
        <div v-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField" :title-field2="titleField2"></Cancel>
        </div>
        <div v-else-if="link == 'change_ip'" class="col">
            <ChangeIp :id="id" :cur-ip="serviceInfo.floating_ip_target_ip"></ChangeIp>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="row shadow-none">
            <div class="col-md-12" v-html="linkDisplay"></div>
        </div>
    </template>
    <template v-else>
        <div class="row row-flex py-4">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body my-3 py-4">
                        <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                            <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                            >{{ clientLink.label }}
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.floating_ips" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-plug">&nbsp;</i>Connection Information</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table-bordered table">
                            <tr v-for="itemValue in extraInfoTables.floating_ips.rows" :key="itemValue.id">
                                <td>{{ itemValue.desc }}</td>
                                <td class="text-success">{{ itemValue.value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.tutorials" class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-video">&nbsp;</i>{{ extraInfoTables.tutorials.title }}</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table-bordered table">
                            <tr v-for="itemValue in extraInfoTables.tutorials.rows" :key="itemValue.id">
                                <td>{{ itemValue.desc }}</td>
                                <td class="text-success">{{ itemValue.value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <div id="commentForm" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form class="inline" method="post" :action="`view_floating_ip?id=${serviceInfo.floating_ip_id}`">
                    <div class="modal-header">
                        <h5 id="exampleModalCenterTitle" class="modal-title">Update Comment</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="id" :value="serviceInfo.floating_ip_id" />
                        <input type="hidden" name="link" value="update_comment" />
                        <input type="hidden" name="edit_comment" value="2" />
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Comment:</label>
                            <textarea id="message-text" v-model="serviceInfo.floating_ip_comment" class="form-control" rows="5" name="comment"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
                        <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style>
@import '../../assets/css/view_service.css';
</style>
