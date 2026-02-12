<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ucwords } from '@/helpers/ucwords';
import { moduleLink } from '@/helpers/moduleLink';

import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { useSslStore } from '@/stores/ssl.store';
import { useSiteStore } from '@/stores/site.store';

import Cancel from '@/components/services/Cancel.vue';
import Invoices from '@/components/services/Invoices.vue';
import ChangeApproverEmail from '@/views/ssl/ChangeApproverEmail.vue';

import { ClientLink, ServiceType, BillingDetails, ExtraInfoTableRow, ExtraInfoTables } from '@/types/view-service-common';
import Swal from 'sweetalert2';

const module: string = 'ssl';
const siteStore = useSiteStore();
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const link = computed(() => {
    return route.params.link;
});

const sslStore = useSslStore();
const { loading, error, pkg, linkDisplay, titleField } = storeToRefs(sslStore);
const isCollapsed = ref(false);
const clientLinks = ref<ClientLink[]>([]);
const serviceInfo = ref<ServiceInfo>({
    ssl_id: '',
    ssl_hostname: '',
    ssl_order_id: '',
    ssl_type: '',
    ssl_currency: '',
    ssl_order_date: '',
    ssl_custid: '',
    ssl_status: '',
    ssl_invoice: '',
    ssl_coupon: '',
    ssl_firstname: '',
    ssl_lastname: '',
    ssl_phone: '',
    ssl_email: '',
    ssl_company: '',
    ssl_address: '',
    ssl_city: '',
    ssl_state: '',
    ssl_zip: '',
    ssl_country: '',
    ssl_department: '',
    ssl_extra: '',
    ssl_approver_email: null,
    ssl_csr: null,
    ssl_private_key: null,
    ssl_x509: null,
    ssl_ca_root: null,
    ssl_ca_inter: null,
});
const billingDetails = ref<BillingDetails>({
    service_last_invoice_date: '',
    service_frequency: '',
    service_currency: '',
    service_currency_symbol: '',
    service_cost_info: '',
    service_extra: '',
});
const serviceStatusColor = ref('');

interface ViewSslResponse {
    serviceInfo: ServiceInfo;
    client_links: ClientLink[];
    billingDetails: BillingDetails;
    custCurrency: string;
    custCurrencySymbol: string;
    package: string;
    serviceExtra: ServiceExtra;
    extraInfoTables: ExtraInfoTables;
    serviceType: ServiceType;
    order_details: OrderDetails;
    order_status: null | string;
    cert_status: null | string;
}

interface ServiceInfo {
    ssl_id: string;
    ssl_hostname: string;
    ssl_order_id: string;
    ssl_type: string;
    ssl_currency: string;
    ssl_order_date: string;
    ssl_custid: string;
    ssl_status: string;
    ssl_invoice: string;
    ssl_coupon: string;
    ssl_firstname: string;
    ssl_lastname: string;
    ssl_phone: string;
    ssl_email: string;
    ssl_company: string;
    ssl_address: string;
    ssl_city: string;
    ssl_state: string;
    ssl_zip: string;
    ssl_country: string;
    ssl_department: string;
    ssl_extra: string;
    ssl_approver_email: null | string;
    ssl_csr: null | string;
    ssl_private_key: null | string;
    ssl_x509: null | string;
    ssl_ca_root: null | string;
    ssl_ca_inter: null | string;
}

interface ServiceExtra {
    [key: string]: any;
}

interface OrderDetails {
    [key: string]: any;
}

function loadLink(newLink: string) {
    console.log(`link is now ${newLink}`);
    siteStore.setBreadcrums([
        ['/home', 'Home'],
        [`/${moduleLink(module)}`, 'SSL Certificates'],
    ]);
    siteStore.addBreadcrum(`/${moduleLink(module)}/${id}`, `View SSL Certificate ${id}`);
    if (typeof newLink == 'undefined') {
        siteStore.setPageHeading(`View SSL Certificate ${id}`);
        siteStore.setTitle(`View SSL Certificate ${id}`);
    } else {
        siteStore.setPageHeading(`SSL Certificate ${id} ${ucwords(newLink.replace('_', ' '))}`);
        siteStore.setTitle(`SSL Certificate ${id} ${ucwords(newLink.replace('_', ' '))}`);
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
                        console.log('error');
                        console.log(error);
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

sslStore.getById(id);
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-3">
            <div class="small-box bg-secondary">
                <div class="inner px-3 pb-1 pt-2">
                    <h3>Package</h3>
                    <p class="text-bold m-0 py-1">{{ pkg }}</p>
                    <p class="m-0">
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">{{ serviceInfo.ssl_hostname }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div :class="'small-box bg-' + serviceStatusColor">
                <div class="inner px-3 pb-1 pt-2">
                    <h3>Billing</h3>
                    <p class="m-0 py-1">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b> billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                    <p class="m-0">
                        Payment Status:
                        <b>
                            {{ billingDetails.service_payment_status ? billingDetails.service_payment_status : 'Un-Paid' }}
                        </b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer"
                    >Status is: <b>{{ serviceInfo.ssl_status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-info">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Order Info</h3>
                    <p class="my-2 py-2">
                        Order ID: <b>{{ serviceInfo.ssl_order_id }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select: none">policy</i>
                </div>
                <span class="small-box-footer"
                    >Order Status: <b>{{ serviceInfo.ssl_status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-purple">
                <div class="inner px-3 pb-1 pt-3">
                    <h3>Cert Info</h3>
                    <p class="my-2 py-2">Cert ID:</p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select: none">admin_panel_settings</i>
                </div>
                <span class="small-box-footer"
                    >Cert Status: <b>{{ serviceInfo.ssl_order_id }}</b></span
                >
            </div>
        </div>
    </div>
    <div v-if="link" class="row shadow-none">
        <div v-if="link == 'change_approver_email'" class="col">
            <ChangeApproverEmail :id="id"></ChangeApproverEmail>
        </div>
        <div v-else-if="link == 'cancel'" class="col">
            <Cancel :id="id" :module="module" :package="pkg" :title-field="titleField"></Cancel>
        </div>
        <div v-else-if="link == 'invoices'" class="col">
            <Invoices :id="id" :module="module"></Invoices>
        </div>
        <div v-else class="col" v-html="linkDisplay"></div>
    </div>
    <div v-else-if="!linkDisplay || (link && ['cancel', 'resend_approver_email', 'reissue_cert'].includes(link))" class="row row-flex">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-show="!isCollapsed" class="card-body">
                    <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/' + moduleLink(module) + '/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip">
                        <i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                        >{{ clientLink.label }}
                    </router-link>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card card-primary-outline">
                <div class="card-header card-primary-outline">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-certificate">&nbsp;</i>SSL Certificates</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-show="!isCollapsed" class="card-body">
                    <table class="table-bordered table">
                        <tbody>
                            <tr>
                                <td>
                                    <b>For Certificate Installation Instructions</b>
                                </td>
                                <td>
                                    <a href="https://support.globalsign.com/#category_SSL_Installation" target="__blank" class="link">Click Here</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    <h3 class="text-muted text-bold text-center">CSR</h3>
                    <blockquote class="quote-secondary h-30">
                        <code style="max-height: 130px; display: inline-block; overflow: scroll; user-select: all"></code>
                    </blockquote>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import '../../assets/css/view_service.css';
</style>
