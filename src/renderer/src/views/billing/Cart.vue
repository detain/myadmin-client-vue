<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import type { SimpleStringObj, CartResponse, ModuleCounts, Modules, CurrencyArr, PaymentMethodsData, ModuleSettings, InvRow, CCRow, HDRow, ServerRow } from '@/types/cart.ts';
import $ from 'jquery';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const route = useRoute();
const accountStore = useAccountStore();
const baseUrl = siteStore.getBaseUrl();
const { loading, error, custid, ima, data, ip } = storeToRefs(accountStore);
const paymentMethod = ref('paypal');
const invoices = ref<string[]>([]);
const modules = ref<Modules>({});
const editCcIdx = ref(0);
const selectedCc = ref(0);
const primaryCc = ref<null | number>(null);
const r_paymentMethod = ref('');
const country_select = ref('');
const invrows = ref<InvRow[]>([]);
const currency = ref('USD');
const currencyArr = ref<CurrencyArr>({});
const invoiceDays = ref(0);
const routeInvoices = computed(() => (route.params.invoices ? String(route.params.invoices).split(',') : undefined));
const order_msg = ref(false);
const total_display = ref('');
const total_invoices = ref(0);
const paymentMethodsData = ref<PaymentMethodsData>({});
const current_cc_id = ref(0);
const triggerClick = ref(null);
const toggleStatus = ref<Record<string, boolean>>({});
const isChecked = ref(false);
const modulesCounts = ref<ModuleCounts>({});
const countries = ref({});
const prepayAvailable = ref(0);
const st = ref<null | string>(null);
const contFields = reactive<SimpleStringObj>({
    cc: '',
    cc_exp: '',
    name: '',
    address: '',
    phone: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
});
siteStore.setPageHeading('Cart');
siteStore.setTitle('Cart');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Cart'],
]);

const selectedAmount = computed(() => {
    let total = 0;
    for (const invrow of invrows.value) {
        if (invoices.value.includes(invrow.service_label)) {
            total += Number(invrow.invoices_amount);
        }
    }
    return total;
});

function formattedCost(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.value,
    }).format(amount);
}

function mounted() {
    if (triggerClick.value) {
        $(`#unver_${current_cc_id.value}`).attr('data-step', triggerClick.value).trigger('click');
    }
}

function deleteCardModal(cc_id = 0) {
    $('#cc_idx').val(cc_id);
    Swal.fire({
        icon: 'warning',
        title: '<h3>Delete CreditCard</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: `<p>Are you sure want to remove your creditcard <br><b>${data.value.ccs[cc_id]['cc']}</b> ?</p>`,
        preConfirm: () => {
            try {
                fetchWrapper.delete(`${baseUrl}/billing/ccs/${cc_id}`).then((response) => {
                    console.log('delete cc success');
                    console.log(response);
                });
            } catch (error: any) {
                console.log('delete cc failed');
                console.log(error);
            }
            $('#deleteForm').submit();
        },
    });
}

function addCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/ccs/add`, {
                cc: contFields.cc,
                cc_exp: contFields.cc_exp,
                name: contFields.name,
                address: contFields.address,
                city: contFields.city,
                state: contFields.state,
                zip: contFields.zip,
                country: contFields.country,
            })
            .then((response) => {
                console.log('add cc success');
                console.log(response);
            });
    } catch (error: any) {
        console.log('add cc failed');
        console.log(error);
    }
}

function editCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/ccs/${editCcIdx.value}`, {
                cc: contFields.cc,
                cc_exp: contFields.cc_exp,
                name: contFields.name,
                address: contFields.address,
                city: contFields.city,
                state: contFields.state,
                zip: contFields.zip,
                country: contFields.country,
            })
            .then((response) => {
                console.log('edit cc success');
                console.log(response);
            });
    } catch (error: any) {
        console.log('edit cc failed');
        console.log(error);
    }
}

function addCardModal() {
    for (let key in contFields) {
        contFields[key] = data.value[key] && key !== 'cc' && key !== 'cc_exp' ? data.value[key] : '';
    }
    $('#AddClick').trigger('click');
}

function editCardModal(cc_id = 0) {
    editCcIdx.value = cc_id;
    for (let key in contFields) {
        if (data.value.ccs[editCcIdx.value][key]) {
            contFields[key] = data.value.ccs[editCcIdx.value][key];
        } else if (data.value[key]) {
            contFields[key] = data.value[key];
        } else {
            contFields[key] = '';
        }
    }
    $('#EditClick').trigger('click');
}

function verifyCard(cc_id = 0) {
    $('.v_cc_idx').val(cc_id);
    const verifyDisplay = $(`#unver_${cc_id}`).attr('data-step');
    if (typeof verifyDisplay === 'undefined') {
        $('#VerifyFormStep1').trigger('click');
    } else if (verifyDisplay === 'step1') {
        $('#VerifyFormStep1').trigger('click');
    } else if (verifyDisplay === 'step2') {
        $('#VerifyClick').trigger('click');
    }
}

function updatePaymentMethod(cc_val: string, cc_auto = 0) {
    if (cc_auto == 1) {
        if ($('#customSwitch3').is(':checked')) {
            $('#cc_auto_update').val(1);
        } else {
            $('#cc_auto_update').val(0);
        }
    } else {
        $('#defaultpaymentMethod').val(cc_val);
    }
    //$("#defaultpymt").submit();
}

function formatCardNum(e: any) {
    if (e.target.value == e.target.lastValue) return;
    let caretPosition = e.target.selectionStart;
    const sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    let i, len;
    for (i = 0, len = sanitizedValue.length; i < len; i += 4) {
        parts.push(sanitizedValue.substring(i, i + 4));
    }
    for (i = caretPosition - 1; i >= 0; i--) {
        const c = e.target.value[i];
        if (c < '0' || c > '9') {
            caretPosition--;
        }
    }
    caretPosition += Math.floor(caretPosition / 4);
    e.target.value = e.target.lastValue = parts.join('-');
    e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

function formatExpDate(e: any) {
    if (e.target.value == e.target.lastValue) return;
    let caretPosition = e.target.selectionStart;
    const sanitizedValue = e.target.value.replace(/[^0-9]/gi, '');
    const parts: string[] = [];
    let i;
    for (i = 0; i < 2; i += 2) {
        parts.push(sanitizedValue.substring(i, i + 2));
    }
    if (sanitizedValue.length >= 2) {
        for (let j = 2; j < sanitizedValue.length; j += 5) {
            parts.push(sanitizedValue.substring(j, j + 5));
        }
    }
    for (i = caretPosition - 1; i >= 0; i--) {
        const c = e.target.value[i];
        if (c < '0' || c > '9') {
            caretPosition--;
        }
    }
    caretPosition += Math.floor(caretPosition / 2);
    e.target.value = e.target.lastValue = parts.join('/');
    e.target.selectionStart = e.target.selectionEnd = caretPosition;
}

function toggleCheckBox() {}

function checkClass(module: string) {
    if (typeof toggleStatus.value[module] === 'undefined') {
        toggleStatus.value[module] = false;
    }
    if (toggleStatus.value[module] === false) {
        for (let idx = 0; idx < invrows.value.length; idx++) {
            const invRow = invrows.value[idx];
            if (invRow.invoices_module == module && !invoices.value.includes(invRow.service_label)) {
                invoices.value.push(invRow.service_label);
            }
        }
    } else {
        for (let idx = 0; idx < invrows.value.length; idx++) {
            const invRow = invrows.value[idx];
            if (invRow.invoices_module == module) {
                const index = invoices.value.indexOf(invRow.service_label);
                if (index > -1) {
                    invoices.value.splice(index, 1);
                }
            }
        }
    }
    toggleStatus.value[module] = !toggleStatus.value[module];
}

async function delete_invoice(invId: number) {
    Swal.fire({
        icon: "warning",
        title: '<h3>Invoice Delete ?</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: '<p>Are you sure want to delete your invoice?</p>',
        preConfirm: () => {
            console.log('Wanted to delete invoice: ', invId);
            for (let idx = 0; idx < invrows.value.length; idx++) {
                const invRow = invrows.value[idx];
                const resp = invRow.invoices_description.match("^Prepay ID ([0-9]*) Invoice$");
                if (resp) {
                    const prepayId = resp[1];
                    fetchWrapper.delete(`${baseUrl}/billing/prepays/${prepayId}`).then((response) => {
                        console.log("Deleted Invoice ",prepayId);
                    });
                }
            }
            //fetchWrapper.delete(`${baseUrl}/billing/prepays/${query}`).then((respons
        }
    });
}

async function toggleCheckbox() {
    const el = document.getElementById('checkboxtoggle') as HTMLInputElement | null;
    if (el?.checked) {
        checkAll();
    } else {
        uncheckAll();
    }
}

async function updateInfoSubmit() {
    try {
        console.log('posting contact fields:',contFields);
        const response = await fetchWrapper.post(`${baseUrl}/account`, contFields);
        console.log(response);
        for (let key in contFields) {
            data.value[key] = contFields[key];
        }
        $("#edit-info").modal('hide');
    } catch (error: any) {
        console.log(error);
    }

}

async function checkAll() {
    invoices.value = [];
    for (let idx = 0; idx < invrows.value.length; idx++) {
        const invRow = invrows.value[idx];
        if (typeof invRow?.prepay_invoice == 'undefined') {
            invoices.value.push(invRow.service_label);
        }
    }
}

function uncheckAll() {
    invoices.value = [];
}

function checkRecent() {}

function checkActive() {}

function onCardNumInput(e: any) {
    formatCardNum(e);
}

function onExpDateInput(e: any) {
    formatExpDate(e);
}

function submitForm(value: any) {
    loadCartData();
}

async function loadCountries() {
    try {
        fetchWrapper.get(`${baseUrl}/account/countries`).then((response) => {
            countries.value = response;
        });
    } catch (error: any) {
        console.log('error:');
        console.log(error);
    }
}

async function pageInit() {
    loadCountries();
    loadCartData();
    await accountStore.loadOnce();
    for (let key in contFields) {
        contFields[key] = data.value[key] ? data.value[key] : '';
    }
    for (const index in data.value.ccs) {
        const cc_detail = data.value.ccs[index];
        if (data.value.cc == cc_detail.cc && data.value.cc_exp == cc_detail.cc_exp) {
            selectedCc.value = Number(index);
            primaryCc.value = Number(index);
            break;
        }
    }
}

async function loadCartData() {
    try {
        const params = new URLSearchParams();
        let query = '';
        if (invoiceDays.value != 0) {
            params.set('invoice_days', invoiceDays.value.toString());
        }
        if (params.size > 0) {
            query = `?${params.toString()}`;
        }
        fetchWrapper.get(`${baseUrl}/billing/cart${query}`).then((response: CartResponse) => {
            console.log(response);
            paymentMethodsData.value = response.paymentMethodsData;
            invrows.value = response.invrows;
            modules.value = response.modules;
            modulesCounts.value = response.modules_counts;
            total_invoices.value = Number(response.total_invoices);
            total_display.value = response.total_display;
            prepayAvailable.value = Number(response.prepay);
            currencyArr.value = response.currency_arr;
            invoiceDays.value = Number(response.invoice_days);
            let checkedInvoices: string[] = [];
            for (const idx in response.invrows) {
                let row = response.invrows[idx];
                if ((typeof routeInvoices.value == 'undefined' && typeof row.prepay_invoice == 'undefined') || (typeof routeInvoices.value != 'undefined' && (routeInvoices.value.includes(row.service_label) || routeInvoices.value.includes(String(row.invoices_id))))) {
                    checkedInvoices.push(row.service_label);
                }
            }
            console.log(checkedInvoices);
            invoices.value = checkedInvoices;
        });
    } catch (error: any) {
        console.log('error:');
        console.log(error);
    }
}

pageInit();
</script>

<template>
    <div v-if="order_msg" class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>Thank you! for your order.</h5>
                <p class="text-md" v-html="order_msg"></p>
            </div>
        </div>
    </div>
    <div class="row justify-content-center mt-2">
        <div class="col-md-9">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="fa fa-money">&nbsp;</i>Pay Balance</h3>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row my-2">
                        <div class="col-md-12">
                            <span class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">1</span>
                            <b class="text-lg">Billing Address</b>
                        </div>
                        <div v-if="data.address && data.address !== ' '" class="col-md-4 b-radius card ml-5 mt-4 p-4" style="border: 1px solid rgba(204, 204, 204, 0.397)">
                            <div class="row">
                                <div class="col-md-2 mb-3">
                                    <div class="icheck-success">
                                        <input id="contact_check" type="radio" class="form-check-input" checked />
                                        <label for="contact_check"></label>
                                    </div>
                                </div>
                                <div class="col-md-10 mb-3">
                                    <b class="text-lg">Home</b><br />
                                    <template v-if="data.name && data.name !== ''">
                                        <b class="text-md mb-2">{{ data.name }}</b>
                                        <br />
                                    </template>
                                    <template v-if="data.address && data.address !== ''"> {{ data.address }}<br /> </template>
                                    <template v-if="data.city && data.zip && data.country"> {{ data.city }}, {{ data.zip }}, {{ data.state }}, {{ data.country }}<br /> </template>
                                    <template v-else-if="data.city && data.zip && !data.country"> {{ data.city }}, {{ data.zip }}, {{ data.state }}<br /> </template>
                                    <template v-else> {{ data.city }}, {{ data.state }}<br /> </template>
                                    <template v-if="data.phone !== ''">
                                        <span class="mt-2">{{ data.phone }}</span>
                                    </template>
                                </div>
                                <div class="col-md-12 pr-3 text-right">
                                    <a href="javascript:void(0);" class="btn btn-custom btn-sm px-3 py-1" data-toggle="modal" data-target="#edit-info" title="Update Contact Info"> <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>EDIT </a>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card my-3 ml-5 px-4 py-3">
                            <div class="card-header">
                                <h5 class="card-title text-bold py-2">Please Add Billing Address to continue Purchase.</h5>
                            </div>
                            <div class="card-body mx-auto my-2">
                                <router-link to="/account/info" class="btn btn-custom px-3 py-2" title="Add Billing Address to continue"> <i class="fa fa-plus"></i>&nbsp;Add Billing Address </router-link>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="row mt-5">
                        <div class="col-md-5 p-0">
                            <div class="col-md-12">
                                <span class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">2</span>
                                <b class="text-lg"># Of Products</b>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="invoice_days" class="col-md-4 col-form-label">Filter</label>
                                    <select id="invoice_days" v-model="invoiceDays" class="col-md-8 select2 form-control text-left" name="invoice_days" @change="submitForm">
                                        <option value="-1">All Days</option>
                                        <option value="30">30 Days</option>
                                        <option value="60">60 Days</option>
                                        <option value="90">90 Days</option>
                                        <option value="365">1 Year</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="currency_select" class="col-md-6 col-form-label">Currency</label>
                                    <select id="currency_select" v-model="currency" class="col-md-6 select2 form-control text-left" name="currency" @change="submitForm">
                                        <option v-for="(value, name, index) in currencyArr" :key="index" :value="value">{{ name }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <template v-if="invrows.length > 0">
                        <table class="table-md mx-auto my-0 table" style="width: 88%">
                            <thead>
                                <tr>
                                    <th style="width: 5%">
                                        <div class="icheck-success d-inline">
                                            <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value="" checked @change="toggleCheckbox" />
                                            <label for="checkboxtoggle"> </label>
                                        </div>
                                    </th>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Service Status</th>
                                    <th>Actions</th>
                                    <th class="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(invrow, key) in invrows" :key="key" :class="[invrow.invoices_module !== 'default' ? modules[invrow.invoices_module] : '', invrow.days_old <= 31 ? 'recentrow' : 'oldrow', `inv${invrow.invoices_module}${invrow.invoices_id}row`, invrow.invoices_service > 0 ? `service${invrow.invoices_module}${invrow.invoices_service}` : '', invrow.collapse === 1 ? `collapse toggle${invrow.invoices_module}${invrow.invoices_service}` : '', invrow.service_line === 1 ? 'service_main collapsed' : '', invrow.prepay_invoice ? 'prepay_invoice_row' : '']" :data-toggle="invrow.service_line === 1 ? 'collapse' : null" :data-target="invrow.service_line === 1 ? `.toggle${invrow.invoices_module}${invrow.invoices_service}` : null">
                                    <td>
                                        <div class="icheck-success d-inline">
                                            <input :id="'check' + invrow.invoices_id" v-model="invoices" type="checkbox" name="invoices" :value="invrow.service_label" class="inv_checkbox" />
                                            <label :for="'check' + invrow.invoices_id"> </label>
                                        </div>
                                    </td>
                                    <td>
                                        <template v-if="invrow.invoices_module === 'default'">{{ invrow.service }}</template>
                                        <template v-else-if="invrow.collapse !== 1">
                                            <router-link class="text-primary" :to="`/${modules[invrow.invoices_module].TABLE}/${invrow.invoices_service}`">{{ invrow.service }}</router-link>
                                        </template>
                                    </td>
                                    <td>{{ invrow.invoices_description }}</td>
                                    <td>{{ invrow.date }}</td>
                                    <td>{{ invrow.service_status }}</td>
                                    <td class="text-center">
                                        <template v-if="invrow.prepay_invoice || invrow.service_status === 'pending'">
                                            <a href="javascript:void(0);" title="Delete Invoice" @click="delete_invoice(invrow.invoices_id)"><i class="fa fa-trash"></i></a>
                                        </template>
                                        <template v-else>
                                            <span class="font-italic text-muted text-sm">Empty...</span>
                                        </template>
                                    </td>
                                    <td>{{ invrow.currency_display }}</td>
                                </tr>
                                <tr>
                                    <td>Filter</td>
                                    <td colspan="7">
                                        <input id="checkboxtoggle" v-model="isChecked" type="checkbox" name="uncheckAll" value="" @change="toggleCheckbox" />
                                        <button type="button" class="btn bg-teal btn-sm" @click="checkAll">All</button>
                                        <button type="button" class="btn bg-teal btn-sm" @click="uncheckAll">None</button>
                                        <button type="button" class="btn bg-teal btn-sm" @click="checkRecent">Past Month</button>
                                        <button type="button" class="btn bg-teal btn-sm" @click="checkActive">Active</button>
                                        <button v-for="(count, module) in modulesCounts" :key="module" class="btn btn-sm bg-teal" @click="checkClass(String(module))">
                                            {{ (module as string).charAt(0).toUpperCase() + (module as string).slice(1) }} <span class="badge badge-light ml-1">{{ count }}</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <hr />
                        <div class="row mt-4">
                            <div class="col-md-12">
                                <span id="step_3" class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">3</span>
                                <b class="text-lg">Payment Options</b>
                            </div>
                            <div class="col-md-12 b-radius mt-4 px-5 py-3" style="background: #f4f4f4">
                                <h5 class="text-bold text-md text-capitalize">How do you want to Pay?</h5>
                                <span id="payments-section">
                                    <span v-for="(methodData, methodId) in paymentMethodsData" :key="methodId">
                                        <a v-if="methodData.text === 'Select Credit Card'" :class="methodData.link_class" :style="methodData.link_style" @click.prevent="paymentMethod = 'cc'">{{ methodData.text }} <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" /></a>
                                        <router-link v-else :to="'/pay/' + methodId + '/' + invoices.join(',')" :class="methodData.link_class" :style="methodData.link_style">{{ methodData.text }} <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" /></router-link>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div id="select_card">
                            <div class="row my-2">
                                <div class="col-md-12">
                                    <span id="step_4" class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">4</span>
                                    <b class="text-lg">Select / Add Credit Card</b>
                                    <a href="javascript:void(0);" class="btn btn-custom float-right" @click.prevent="addCardModal"><i class="fa fa-plus" aria-hidden="true">&nbsp;</i>Add New Card</a>
                                </div>
                                <div id="selectcardmsg" class="col-md-12 d-flex mt-3"></div>

                                <template v-if="data.ccs">
                                    <div v-for="(cc_detail, cc_id) in data.ccs" :key="cc_id" class="col-md-5 b-radius card ml-5 mt-4 p-4" style="border: 1px solid rgba(204, 204, 204, 0.397)" :style="primaryCc === Number(cc_id) ? 'background-color: rgba(204, 204, 204, 0.397);' : ''">
                                        <div v-if="primaryCc === Number(cc_id)" class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">Primary</div>
                                        </div>
                                        <form id="paymentform" action="cart" method="post">
                                            <div class="row">
                                                <div class="col-md-12 mb-3">
                                                    <div class="icheck-success">
                                                        <input :id="'cc-' + cc_id" v-model="selectedCc" :value="Number(cc_id)" type="radio" class="form-check-input" :disabled="cc_detail.verified_cc === 'no'" :data-toggle="cc_detail.verified_cc === 'no' ? 'tooltip' : null" :title="cc_detail.verified_cc === 'no' ? cc_detail.verified_text : ''" @change="updatePaymentMethod('cc' + cc_id)" />
                                                        <label :for="'cc-' + cc_id" class="pb-2 text-lg" style="letter-spacing: 4px">{{ cc_detail.cc }}</label>
                                                    </div>
                                                    <div class="ml-2 pl-4">
                                                        <div class="my-2 text-sm">
                                                            <b class="text-md">{{ cc_detail.name }}</b>
                                                        </div>
                                                        <div class="text-muted text-sm">Expires on {{ cc_detail.cc_exp }}</div>
                                                        <div class="my-2">
                                                            <template v-if="selectedCc === Number(cc_id)">
                                                                <div id="selected_services"></div>
                                                                <input type="hidden" name="balance" value="1" />
                                                                <input type="password" name="cc_ccv2" placeholder="cvv2" style="border-radius: 5px; width: 100%" minlength="3" maxlength="4" required :oninvalid="`this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')`" @input="`setCustomValidity('')`" />
                                                            </template>
                                                            <template v-else> &nbsp; </template>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6 pl-4">
                                                    <a v-if="cc_detail.verified_cc === 'no'" :id="'unver_' + cc_id" class="tn btn-outline-custom btn-xs ml-2 px-3 py-1" href="payment_types?action=verify" style="text-decoration: none" :title="cc_detail.unverified_text"> <i class="fa fa-exclamation-triangle"></i>&nbsp;Verify </a>
                                                    <a v-else-if="cc_detail.verified_cc !== 'no' && selectedCc !== Number(cc_id)" :id="'editcard-modal-' + cc_id" class="btn btn-custom btn-sm ml-2 px-3 py-1" href="javascript:void(0);" :title="cc_detail.edit_text" data-toggle="modal" data-target="#edit-card" @click.prevent="editCardModal(Number(cc_id))"> <i class="fa fa-edit" aria-hidden="true">&nbsp;</i>Edit </a>
                                                    <div v-else-if="selectedCc === Number(cc_id)" class="text-success text-lg" name="totalccamount"></div>
                                                </div>

                                                <div class="col-md-6 text-right">
                                                    <a v-if="(selectedCc !== Number(cc_id) || cc_detail.verified_cc === 'no') && paymentMethod === 'cc'" class="btn btn-outline-custom btn-xs px-3 py-1" href="javascript:void(0);" :title="cc_detail.delete_text" style="text-decoration: none" @click.prevent="deleteCardModal(Number(cc_id))"> <i class="fa fa-trash"></i>&nbsp;Delete </a>
                                                    <input v-else-if="selectedCc === Number(cc_id)" id="paynow" type="submit" class="btn btn-outline-custom btn-sm" style="border-radius: 5px" value="Pay Now" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </template>
                                <div v-else class="col-md-12 b-radius mt-4 px-5 py-3" style="background: #f4f4f4">
                                    <h5 class="text-bold text-md text-capitalize">You Have 0 Credit Cards</h5>
                                    <span class="text-red">To Add a Credit Card, Please Click on the Add New Card Button.</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </template>
                    <template v-else>
                        <table class="table-md mx-auto my-0 table" style="width: 88%">
                            <thead>
                                <tr>
                                    <th style="width: 5%">
                                        <div class="icheck-success d-inline">
                                            <input id="checkboxtoggle" type="checkbox" name="uncheckAll" value="" @change="toggleCheckbox" />
                                            <label for="checkboxtoggle"> </label>
                                        </div>
                                    </th>
                                    <th>Service</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Service Status</th>
                                    <th>Actions</th>
                                    <th class="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="7" class="text-bold b-radius text-center text-black" style="background: #f4f4f4">No Invoices to pay...</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <div v-if="currency === 'INR'" class="col-md-12 alert alert-info b-radius mb-0 mt-4 text-sm">
                        <h4 class="text-bold text-capitalize text-lg">Manual Bank Payment Option:</h4>
                        <p class="form-text m-0">
                            <b>Name:</b> ROCKSOLID INTERSERVER PRIVATE LIMITED<br />
                            <b>Current A/C No:</b> 155605010028<br />
                            <b>IFSC Code:</b> ICIC0001556<br />
                            After payment is made open a support ticket with the transaction id, date, and amount paid. We will manually credit the payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card" style="position: fixed; top: 30%; width: 22%">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="fa fa-file-invoice">&nbsp;</i>Balance & Invoice Info</h3>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table-sm table">
                        <tbody>
                            <tr>
                                <td class="text-center" colspan="2" style="border: none">
                                    <div><strong>Total Invoices</strong></div>
                                    <div class="text-success text-lg">{{ total_invoices }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <div><strong>Invoices Total Amount</strong></div>
                                    <div class="text-success text-lg">{{ total_display }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">
                                    <div><strong>PrePay Available</strong></div>
                                    <div class="text-success text-lg">{{ formattedCost(prepayAvailable) }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <div><strong>To Be Paid</strong></div>
                                    <div class="text-success text-lg">{{ formattedCost(selectedAmount) }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div id="AddClick" class="d-none" data-toggle="modal" data-target="#add-card"></div>
    <div id="add-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Add Credit Card</h4>
                </div>
                <div class="modal-body">
                    <form action="cart" method="post" class="form-card">
                        <input type="hidden" name="action" value="add" />
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="cr_no" v-model="contFields.cc" type="text" name="cc" placeholder="0000 0000 0000 0000" minlength="19" maxlength="19" required oninvalid="this.setCustomValidity('Please Enter valid 16 digit credit card number')" oninput="setCustomValidity('')" />
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" minlength="7" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')" />
                                            <label class="text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit card number')" oninput="setCustomValidity('')" />
                                            <label class="text-md">CVV</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.name" type="text" name="name" placeholder="Name on card" required oninvalid="this.setCustomValidity('Please Enter full name on your card')" oninput="setCustomValidity('')" />
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.address" type="text" name="address" placeholder="Address line" />
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input type="text" name="city" :nodel="contFields.city" placeholder="City" />
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" type="text" name="state" placeholder="State" />
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <select v-model="contFields.country" name="country" class="form-control" style="padding-right: 5px; vertical-align: middle; float: right" disabled>
                                        <option v-for="(name, iso2, index) in countries" :key="index" :value="iso2">{{ name }}</option>
                                    </select>
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.zip" type="text" name="zip" placeholder="Zipcode" />
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Add Credit Card" class="btn btn-pay placeicon" @click.prevent="addCardSubmit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div id="edit-info" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Update Contact Info</h4>
                </div>
                <div class="modal-body">
                    <form id="EditInfo" method="post" class="form-card" @submit.prevent="updateInfoSubmit">
                        <input type="hidden" name="action" value="edit_info" />
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.name" type="text" name="name" placeholder="You Name" />
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.address" type="text" name="address" placeholder="Address line" />
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.phone" type="text" name="phone" placeholder="Phone Number" required />
                                    <label class="text-md">Phone</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.city" type="text" name="city" placeholder="City" />
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" type="text" name="state" placeholder="State" />
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <select v-model="contFields.country" name="country" class="form-control" style="padding-right: 5px; vertical-align: middle; float: right" disabled>
                                        <option v-for="(name, iso2, index) in countries" :key="index" :value="iso2">{{ name }}</option>
                                    </select>
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.zip" type="text" name="zip" placeholder="Zipcode" />
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Update Info" class="btn btn-pay placeicon" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div id="EditClick" class="d-none" data-toggle="modal" data-target="#edit-card"></div>
    <!--EDIT CC FORM IN MODAL-->
    <div id="edit-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">Update Credit Card</h4>
                </div>
                <div class="modal-body">
                    <form id="EditForm" action="cart" method="post" class="form-card">
                        <input type="hidden" name="action" value="edit" />
                        <input id="e_cc_idx" v-model="editCcIdx" type="hidden" name="idx" />
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="e_exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" oninput="setCustomValidity('')" />
                                    <label class="text-md">Expiry Date</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="e_cr_no" v-model="contFields.cc" style="border: none; letter-spacing: 20px; font-weight: bold" type="text" name="cc" required readonly disabled />
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.name" style="border: none" type="text" name="name" placeholder="Name on card" />
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.address" style="border: none" type="text" name="address" placeholder="Address line" disabled />
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.city" style="border: none" type="text" name="city" placeholder="City" disabled />
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" style="border: none" type="text" name="state" placeholder="State" disabled />
                                    <label class="text-md">State</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.country" style="border: none" type="text" name="Country" placeholder="Country" />
                                    <label class="text-md">Country</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.zip" style="border: none" type="text" name="zip" placeholder="Zipcode" disabled />
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12">
                                <input type="submit" value="Update Card" class="btn btn-pay placeicon" @click.prevent="editCardSubmit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
