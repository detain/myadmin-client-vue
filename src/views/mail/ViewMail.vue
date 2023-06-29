<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { RouterLink, useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useMailStore, useAuthStore, useAlertStore, useSiteStore } from '@/stores';
import $ from 'jquery';
import { Alerts, DenyRules } from '@/views/mail';

const siteStore = useSiteStore();
const route = useRoute();
const id = route.params.id;
const link = computed(() => {
    return route.params.link;
});
siteStore.setPageHeading('View Mail');
siteStore.setTitle('View Mail');
siteStore.setBreadcrums({ '/home': 'Home', '/mail': 'Mail' });
siteStore.addBreadcrum('/mail/' + id, 'View Mail ' + id);

const mailStore = useMailStore();
const { loading, error, pkg, link_display, settings, serviceInfo, clientLinks, billingDetails, custCurrency, custCurrencySymbol, serviceExtra, extraInfoTables, serviceType, usage_count, csrf } = storeToRefs(mailStore);

mailStore.getById(id);

const status = computed(() => `${settings.value.PREFIX}_status`); // compute your status value here
const statusClass = computed(() => {
    const statusValue = serviceInfo.value[status.value];
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
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo[settings.TITLE_FIELD] }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="statusClass">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Billing</h3>
                    <p class="my-3 py-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer"
                    >Mail Status is: <b>{{ status }}</b></span
                >
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-danger b-radius">
                <div class="inner px-3 pb-2 pt-3">
                    <h3>Mail API</h3>
                    <p class="my-3 py-3">For API Documentation: <a href="https://www.mail.baby/apidoc.html" target="__blank" class="text-bold text-white">Click Here</a></p>
                </div>
                <div class="icon">
                    <i class="material-icons">api</i>
                </div>
                <span class="small-box-footer"> For API Key: <router-link to="/account/settings" class="text-bold text-white">Account Settings</router-link> </span>
            </div>
        </div>
    </div>
    <template v-if="link_display">
        <div v-if="link == 'alerts'" class="col">
            <Alerts :id="id"></Alerts>
        </div>
        <div v-else-if="link == 'deny_rules'" class="col">
            <DenyRules :id="id"></DenyRules>
        </div>
        <div v-else class="row shadow-none">
            <div class="col-md-12">{{ link_display }}</div>
        </div>
    </template>
    <template v-else>
        <div>
            <div class="col-md-12">
                <blockquote style="border-left: 0.4rem solid dimgray; height: 70px; padding-top: 20px; box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%)" class="mx-0 pl-4">
                    <p style="font-size: 20px; vertical-align: middle">
                        <i class="fa fa-mail-bulk pr-2" aria-hidden="true"></i> Mail Usage Count: <strong>{{ usage_count }}</strong>
                    </p>
                </blockquote>
            </div>
        </div>
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
                        <router-link v-for="(clientLink, index) in clientLinks" :key="index" :to="'/mail/' + id + '/' + clientLink.link" class="btn btn-app mb-3" :title="clientLink.help_text" data-toggle="tooltip"
                            ><i :class="clientLink.icon" aria-hidden="true">{{ clientLink.icon_text }}</i
                            >{{ clientLink.label }}</router-link
                        >
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.mail" class="col-md-4">
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
                            <tr v-for="itemvalue in extraInfoTables.mail.rows" :key="itemvalue.id">
                                <td>{{ itemvalue.desc }}</td>
                                <td class="text-success">{{ itemvalue.value }}</td>
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
                            <tr v-for="itemvalue in extraInfoTables.tutorials.rows" :key="itemvalue.id">
                                <td>{{ itemvalue.desc }}</td>
                                <td class="text-success">{{ itemvalue.value }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <div class="modal fade" id="commentForm" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <form class="inline" method="post" :action="`view_mail?id=${serviceInfo.mail_id}`">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Update Comment</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="id" :value="serviceInfo.mail_id" />
                        <input type="hidden" name="link" value="update_comment" />
                        <input type="hidden" name="csrf_token" :value="csrf" />
                        <input type="hidden" name="edit_comment" value="2" />
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Comment:</label>
                            <textarea class="form-control" id="message-text" rows="5" name="comment" v-model="serviceInfo.mail_comment"></textarea>
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

<style scoped></style>
