<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useSslStore, useAuthStore, useAlertStore, useLayoutStore } from '@/stores';
import { ChangeApproverEmail } from '@/views/ssl'

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => { return route.params.link; });
layoutStore.setPageHeading('View Ssl');
layoutStore.setTitle('View Ssl');
layoutStore.setBreadcrums({'/home': 'Home', '/ssl': 'SSL'})
layoutStore.addBreadcrum('/ssl/'+id, 'View Ssl '+id);

const sslStore = useSslStore();
const { loading, error, pkg, link_display } = storeToRefs(sslStore);

sslStore.getById(id)

</script>

<template>
    <div class="row mt-2">
        <div class="col-md-3">
            <div class="small-box bg-secondary">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-1 m-0 text-bold">{{ pkg }}</p>
                    <p class="m-0">Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b></p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <div class="small-box-footer">{{ serviceInfo.ssl_hostname }}</div>
            </div>
        </div>
        <div class="col-md-3">
            <div :class="'small-box bg-' + serviceStatusColor">
                <div class="inner pt-2 pb-1 px-3">
                    <h3>Billing</h3>
                    <p class="py-1 m-0"><b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b></p>
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
                <span class="small-box-footer">Status is: <b>{{ serviceStatus }}</b></span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-info">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Order Info</h3>
                    <p class="py-2 my-2">Order ID: <b>{{ orderId }}</b></p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select:none;">policy</i>
                </div>
                <span class="small-box-footer">Order Status: <b>{{ orderStatus }}</b></span>
            </div>
        </div>
        <div class="col-md-3">
            <div class="small-box bg-purple">
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Cert Info</h3>
                    <p class="py-2 my-2">Cert ID: </p>
                </div>
                <div class="icon">
                    <i class="material-icons" style="user-select:none;">admin_panel_settings</i>
                </div>
                <span class="small-box-footer">Cert Status: <b>{{ certStatus }}</b></span>
            </div>
        </div>
    </div>
    <div v-if="link_display" class="row shadow-none">
        <div v-if="link == 'change_approver_email'" class="col">
            <ChangeApproverEmail :id="id"></ChangeApproverEmail>
        </div>
        <div v-else class="col">{{ link_display }}</div>
    </div>
    <div v-else-if="!link_display || (link && ['cancel', 'resend_approver_email', 'reissue_cert'].includes(link))" class="row row-flex">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-link">&nbsp;</i>Links
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-show="!isCollapsed">
                    <a v-for="clientLink in clientLinks" :key="clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip" :href="clientLink.link" :other_attr="clientLink.other_attr"><i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i>{{ clientLink.label }}</a>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card card-primary-outline">
                <div class="card-header card-primary-outline">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fa fa-certificate">&nbsp;</i>SSL Certificates
                        </h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" @click="isCollapsed = !isCollapsed">
                                <i :class="isCollapsed ? 'fas fa-plus' : 'fas fa-minus'"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-show="!isCollapsed">
                    <table class="table table-bordered">
                        <tr>
                            <td>
                                <b>For Certificate Installation Instructions</b>
                            </td>
                            <td>
                                <a href="https://support.globalsign.com/#category_SSL_Installation" target="__blank" class="link">Click Here</a>
                            </td>
                        </tr>
                    </table>
                    <hr>
                    <h3 class="text-muted text-center text-bold">CSR</h3>
                    <blockquote class="quote-secondary h-30">
                        <code style="max-height: 130px;display: inline-block;overflow: scroll;user-select:all;"></code>
                    </blockquote>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>