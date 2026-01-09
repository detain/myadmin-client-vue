<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps<{
    id: number;
}>();
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const module: string = 'ssl';
const siteStore = useSiteStore();

//const id = ref(''); // Replace with appropriate data or pass as props
const approver_select = ref([]); // Replace with appropriate data or pass as props
const selectedApproverEmail = ref(''); // Stores the selected approver email

interface SslServiceInfo {
    ssl_id: number;
    ssl_hostname: string;
    ssl_order_id: number;
    ssl_type: number;
    ssl_currency: string;
    ssl_order_date: string;
    ssl_custid: number;
    ssl_status: string;
    ssl_invoice: number;
    ssl_coupon: number;
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
    ssl_approver_email: string;
    ssl_csr: string;
    ssl_private_key: string;
    ssl_x509: string;
    ssl_ca_root: string;
    ssl_ca_inter: string;
}

const service_info = ref<SslServiceInfo>({
    ssl_id: 0,
    ssl_hostname: '',
    ssl_order_id: 0,
    ssl_type: 0,
    ssl_currency: '',
    ssl_order_date: '',
    ssl_custid: 0,
    ssl_status: '',
    ssl_invoice: 0,
    ssl_coupon: 0,
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
    ssl_approver_email: '',
    ssl_csr: '',
    ssl_private_key: '',
    ssl_x509: '',
    ssl_ca_root: '',
    ssl_ca_inter: '',
});

function submitForm() {
    // Perform necessary form submission logic here
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-envelope">&nbsp;</i>Change Approver Email</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form method="POST" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="change_approver_email" />
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-right" for="hostname">Hostname</label>
                            <div class="col-sm-8">
                                <input id="hostname" type="text" class="form-control form-control-sm" name="hostname" :value="service_info.ssl_hostname" disabled />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-4 col-form-label text-right" for="approver_email">Select Approver Email</label>
                            <div class="col-sm-8">
                                <select v-model="selectedApproverEmail" name="approver_email" class="form-control form-control-sm select2">
                                    <option v-for="approverEmail in approver_select" :key="approverEmail" :value="approverEmail" :selected="service_info.ssl_approver_email === approverEmail">{{ approverEmail }}</option>
                                </select>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="controls col-md-12 text-center">
                                <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
