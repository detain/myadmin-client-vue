<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';

const layoutStore = useLayoutStore();
const route = useRoute();
const id = route.params.id;
layoutStore.setPageHeading('View Mail');
layoutStore.setBreadcrums({'home': 'Home', 'Mail': 'Mail'})
layoutStore.addBreadcrum('mail/'+id, 'View Mail '+id);

const settings = ref({
    SERVICE_ID_OFFSET: 10000,
    USE_REPEAT_INVOICE: true,
    USE_PACKAGES: true,
    BILLING_DAYS_OFFSET: 45,
    IMGNAME: "mail.png",
    REPEAT_BILLING_METHOD: 2,
    DELETE_PENDING_DAYS: 45,
    SUSPEND_DAYS: 14,
    SUSPEND_WARNING_DAYS: 7,
    TITLE: "Mail Registrations",
    MENUNAME: "Mail",
    EMAIL_FROM: "support@interserver.net",
    TBLNAME: "Mail",
    TABLE: "Mail",
    TITLE_FIELD: "mail_hostname",
    PREFIX: "mail"
});
const serviceInfo = ref({
    mail_id: "592337",
    mail_hostname: "detain.dev",
    mail_username: "detaindev",
    mail_password: "12315688fgfasghs",
    mail_type: "10673",
    mail_currency: "USD",
    mail_expire_date: "2023-08-14 00:59:38",
    mail_order_date: "2022-08-13 20:58:58",
    mail_custid: "2773",
    mail_status: "active",
    mail_invoice: "19917286",
    mail_coupon: "0",
    mail_firstname: "Real",
    mail_lastname: "Person",
    mail_email: "realperson@mymail.com",
    mail_address: "91 Mullberry St.",
    mail_address2: "",
    mail_address3: "",
    mail_city: "Area 51",
    mail_state: "PA",
    mail_zip: "00001",
    mail_country: "US",
    mail_phone: "8675309",
    mail_fax: "",
    mail_company: "InterServer Secaucus",
});
const clientLinks = ref([]);
const billingDetails = ref({
    service_last_invoice_date: "August 13, 2022",
    service_payment_status: "Paid",
    service_frequency: "Yearly",
    next_date: "2023-08-14 00:59:38",
    service_next_invoice_date: "August 14, 2023",
    service_currency: "USD",
    service_currency_symbol: "$",
    service_cost_info: "18.00",
    service_extra: {}
});
const custCurrency = ref("USD");
const custCurrencySymbol = ref("$");
const serviceExtra = ref({});
const extraInfoTables = ref([]);
const serviceType = ref({
    services_id: "10673",
    services_name: ".dev Mail Name Registration",
    services_cost: "18.00",
    services_category: "100",
    services_ourcost: "15.00",
    services_buyable: "1",
    services_type: "100",
    services_field1: ".dev",
    services_field2: "",
    services_module: "Mail"
});
const errors = ref(false);

const loadMail = async (id, serviceType, settings, serviceInfo) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/mail/' + id);
        console.log('api success');
        console.log(response);
        serviceType.value = response.serviceType;
        serviceInfo.value = response.serviceInfo;
        settings.value = response.settings;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadMail(id, serviceType, settings, serviceInfo)

const pkg = ref(''); // set your package value here
const link_display = ref(false);
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
                <div class="inner pt-3 pb-1 px-3">
                    <h3>Package</h3>
                    <p class="py-2 m-0">{{ pkg }}</p>
                    <p>
                        Next Invoice Date: <b>{{ billingDetails.service_next_invoice_date }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-briefcase"></i>
                </div>
                <span class="small-box-footer text-bold">{{ serviceInfo[titleField] }}</span>
            </div>
        </div>
        <div class="col-md-4">
            <div :class="statusClass">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Billing</h3>
                    <p class="py-3 my-3">
                        <b>{{ billingDetails.service_currency_symbol }}{{ billingDetails.service_cost_info }}</b>
                        billed: <b>{{ billingDetails.service_frequency }}</b>
                    </p>
                </div>
                <div class="icon">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <span class="small-box-footer">Mail Status is: <b>{{ status }}</b></span>
            </div>
        </div>
        <div class="col-md-4">
            <div class="small-box bg-danger b-radius">
                <div class="inner pt-3 pb-2 px-3">
                    <h3>Mail API</h3>
                    <p class="py-3 my-3">
                        For API Documentation: <a href="https://www.mail.baby/apidoc.html" target="__blank" class="text-white text-bold">Click Here</a>
                    </p>
                </div>
                <div class="icon">
                    <i class="material-icons">api</i>
                </div>
                <span class="small-box-footer">
                    For API Key: <a class="text-white text-bold" target="_blank" href="account_settings">Account Settings</a>
                </span>
            </div>
        </div>
    </div>
    <template v-if="link_display">
        <div v-if="link_display" class="row shadow-none">
            <div class="col-md-12">{{ link_display }}</div>
        </div>
    </template>
    <template v-else>
        <div>
            <div class="col-md-12">
                <blockquote style="border-left: 0.4rem solid dimgray;height: 70px;padding-top: 20px;box-shadow: 0 0 1px rgb(0 0 0 / 13%), 0 1px 3px rgb(0 0 0 / 20%);" class="pl-4 mx-0">
                    <p style="font-size: 20px;vertical-align: middle;"><i class="fa fa-mail-bulk pr-2" aria-hidden="true"></i> Mail Usage Count: <strong>{{ usage_count }}</strong></p>
                </blockquote>
            </div>
        </div>
        <div class="row row-flex py-4">
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fas fa-link">&nbsp;</i>Links</h3>
                            <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                        </div>
                    </div>
                    <div class="card-body py-4 my-3">
                        <a v-for="client_link in clientLinks" :key="client_link.id" class="btn btn-app" :style="'margin:0px 0px 10px 6px !important;'" :title="client_link.help_text" data-toggle="tooltip" :href="client_link.link" :other_attr="client_link.other_attr">{{client_link.image}}{{client_link.label}}</a>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.mail" class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-plug">&nbsp;</i>Connection Information</h3>
                            <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <tr v-for="itemvalue in extraInfoTables.mail.rows" :key="itemvalue.id">
                                <td>{{itemvalue.desc}}</td>
                                <td class="text-success">{{itemvalue.value}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div v-if="extraInfoTables.tutorials" class="col-md-3">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="fa fa-video">&nbsp;</i>{{extraInfoTables.tutorials.title}}</h3>
                            <div class="card-tools float-right"><button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button></div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered">
                            <tr v-for="itemvalue in extraInfoTables.tutorials.rows" :key="itemvalue.id">
                                <td>{{itemvalue.desc}}</td>
                                <td class="text-success">{{itemvalue.value}}</td>
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
                        <input type="hidden" name="id" :value="serviceInfo.mail_id">
                        <input type="hidden" name="link" value="update_comment">
                        <input type="hidden" name="csrf_token" :value="csrf">
                        <input type="hidden" name="edit_comment" value="2">
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Comment:</label>
                            <textarea class="form-control" id="message-text" rows="5" name="comment" v-model="comment"></textarea>
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

<style scoped>
</style>