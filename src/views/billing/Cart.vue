<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick, watchEffect } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { storeToRefs } from 'pinia';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import type { SimpleStringObj, CartResponse, ModuleCounts, Modules, CurrencyArr, PaymentMethodsData, ModuleSettings, InvRow, HDRow, ServerRow } from '@/types/cart.ts';
import $ from 'jquery';
import Swal from 'sweetalert2';
const { t } = useI18n();
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
const modalCcIdx = ref(0);
const cc_ccv2 = ref('');
const cc_amount1 = ref('');
const cc_amount2 = ref('');
const primaryCc = ref<null | number>(null);
const r_paymentMethod = ref('');
const country_select = ref('');
const invrows = ref<InvRow[]>([]);
const currency = ref('USD');
const currencyArr = ref<CurrencyArr>({});
const invoiceDays = ref(0);
const currencySymbol = ref('$');
const routeInvoices = computed(() => (route.params.invoices ? String(route.params.invoices).split(',') : undefined));
const order_msg = ref(false);
const total = ref(0);
const total_invoices = ref(0);
const paymentMethodsData = ref<PaymentMethodsData>({});
const current_cc_id = ref(0);
const triggerClick = ref(null);
const toggleStatus = ref<Record<string, boolean>>({});
const isChecked = ref(false);
const modulesCounts = ref<ModuleCounts>({});
const countries = ref({});
const prepayAvailable = ref(0);
const payssionMinAmount = ref(0);
const ccAuto = ref(0);
const defaultPaymentMethod = ref('');
const st = ref<null | string>(null);
const paypalLoaded = ref(false);
const paypalScriptEl = ref<HTMLScriptElement | null>(null);
const ppButtons = ref<PayPalButtonsInstance | null>(null);
const cartResponse = ref<CartResponse | null>(null);
const showMethods = computed(() => invoices.value.length > 0 && amountAfterPrepay.value > 0.01);
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
watchEffect(() => {
    siteStore.setPageHeading(t('billing.cart.title'));
    siteStore.setTitle(t('billing.cart.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('billing.cart.title')],
    ]);
});

interface PayPalButtonsInstance {
    render: (selector: string) => Promise<void>;
    close?: () => void;
}

interface PayPalItem {
    name: string;
    quantity: number;
    category: string;
    unit_amount: {
        currency_code: string;
        value: string | number;
    };
}

type Operator = '==' | '<=' | 'typeof';

const operators: Record<Operator, (a: any, b: any) => boolean> = {
    '==': (a, b) => a == b,
    '<=': (a, b) => Number(a) <= Number(b),
    typeof: (a, b) => typeof a === b,
};

const filteredPaymentMethods = computed(() => {
    const result: PaymentMethodsData = {};
    for (const [key, method] of Object.entries(paymentMethodsData.value)) {
        if (key.startsWith('payssion') && amountAfterPrepay.value < payssionMinAmount.value) {
            continue;
        }
        result[key] = method;
    }
    return result;
});

const showPrepay = computed(() => {
    if (prepayAvailable.value <= 0) return false;
    const amounts = invrows.value
        .filter((row) => invoices.value.includes(row.service_label))
        .map((row) => Number(row.invoices_amount));
    if (amounts.length === 0) return false;
    return prepayAvailable.value >= Math.min(...amounts);
});

const paypalMethodStyle = computed(() => {
    const style: Record<string, string> = {};
    style.display = paymentMethod.value === 'paypal' ? 'block' : 'none';
    return style;
});

const fundingSources = computed(() => {
    const country = data.value?.country;
    const funding: string[] = [];
    if (!country) return funding;
    switch (country) {
        case 'US':
            funding.push('venmo');
            break;
        case 'BE':
            funding.push('bancontact');
            break;
        case 'PL':
            funding.push('blik');
            funding.push('p24');
            break;
        case 'AT':
            funding.push('eps');
            break;
        case 'NL':
            funding.push('ideal');
            break;
        case 'IT':
            funding.push('mybank');
            break;
        case 'DE':
            funding.push('pay-upon-invoice');
            break;
    }
    if (['AT', 'DE', 'DK', 'EE', 'ES', 'FI', 'GB', 'LT', 'LV', 'NL', 'NO', 'SE'].includes(country)) {
        funding.push('trustly');
    }
    return funding;
});

const paypalSdkUrl = computed(() => {
    if (!data.value?.country) return '';
    const params = new URLSearchParams({
        'client-id': 'AdYdovDB_vwbBaM0ZCT5l1MUKeAxz_IWeWt8q0hgqtkASsLRTvnlbTMMNxM4xHfJTVw_akRZKmkteMAT',
        'integration-date': '2026-01-01',
        currency: currency.value || 'USD',
        intent: 'capture',
        components: 'buttons,funding-eligibility,applepay,googlepay',
    });
    if (fundingSources.value.length > 0) {
        params.set('enable-funding', fundingSources.value.join(','));
    }
    return `https://www.paypal.com/sdk/js?${params.toString()}`;
});

const paypalItems = computed(() => {
    return invrows.value
        .filter((row) => invoices.value.includes(row.service_label))
        .map((row) => ({
            name: row.service,
            quantity: 1,
            category: 'DIGITAL_GOODS',
            unit_amount: {
                currency_code: row.invoices_currency,
                value: Number(row.invoices_amount).toFixed(2),
            },
        }));
});

const selectedAmount = computed(() => {
    let total = 0;
    for (const invrow of invrows.value) {
        if (invoices.value.includes(invrow.service_label)) {
            total += Number(invrow.invoices_amount);
        }
    }
    return total;
});

// Amount after subtracting prepay balance (what actually needs to be paid)
const amountAfterPrepay = computed(() => {
    const hasPrepayInvoice = invrows.value.some((r) => invoices.value.includes(r.service_label) && typeof r.prepay_invoice !== 'undefined');
    // Don't deduct prepay if paying prepay invoices themselves
    if (hasPrepayInvoice) return selectedAmount.value;
    const afterPrepay = selectedAmount.value - prepayAvailable.value;
    return Math.max(afterPrepay, 0);
});

function getHdDetails(server: ServerRow): string {
    const cart = cartResponse.value;
    if (!cart?.hds || cart.hds.length === 0) return '';
    const hds = cart.hds;
    let serverExtra: { hd?: number[] } | null = null;
    if (server.server_extra) {
        try {
            serverExtra = JSON.parse(server.server_extra);
        } catch (error: any) {
            console.log('jhson parse failed', error);
        }
    }
    const hdDescs: string[] = [];
    for (const hd of hds) {
        let count = 0;
        // Check hd1 match
        if (hd.id === server.server_dedicated_hd1) {
            if (!serverExtra?.hd || !serverExtra.hd.includes(hd.id)) {
                count++;
            }
        }
        // Check hd2 match
        if (hd.id === server.server_dedicated_hd2) {
            if (!serverExtra?.hd || !serverExtra.hd.includes(hd.id)) {
                count++;
            }
        }
        // Check server_extra.hd array
        if (serverExtra?.hd) {
            for (const hdId of serverExtra.hd) {
                if (hdId === hd.id) count++;
            }
        }
        if (count > 0) {
            hdDescs.push(count > 1 ? `${count} x ${hd.short_desc}` : hd.short_desc);
        }
    }
    return hdDescs.join(', ');
}

function getServerComment(invrow: InvRow): string {
    if (invrow.invoices_module !== 'servers') return '';
    const cart = cartResponse.value;
    if (!cart) return '';
    const server = cart.serverInfo?.find(s => s.server_id == invrow.invoices_service);
    if (!server) return '';
    const parts: string[] = [];
    // Server comment
    if (server.server_comment) {
        let serverComment = server.server_comment.replace(/<br>/g, '\n');
        const lines = serverComment.split('\n');
        const idx = lines.findIndex(l => l.includes('Customers IP'));
        if (idx >= 0) {
            serverComment = lines.slice(0, idx + 1).join('\n');
        }
        const cleaned = serverComment
            .replace(/Customers IP \d+\.\d+\.\d+\.\d+/, '')
            .replace(/\n\n/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/^<br>/, '');
        if (cleaned) parts.push(cleaned);
    }
    // Hard drive details
    const hdInfo = getHdDetails(server);
    if (hdInfo) parts.push(`<br>HD: ${hdInfo}`);
    return parts.join('');
}

function getBtnOpts() {
    const btnOpts = {
        // Sets up the transaction when a payment button is clicked
        createOrder: createOrderCallback,
        onApprove: onApproveCallback,
        onError: function (error: any) {
            // Do something with the error from the SDK
        },
        style: {
            shape: 'rect',
            layout: 'vertical',
            //color: "gold",
            //label: "paypal",
            height: 50,
            tagline: false,
        },
    };
    return btnOpts;
}

async function createOrderCallback() {
    resultMessage('');
    try {
        if (invoices.value.join(',').length > 570) {
            throw new Error('Too many invoices selected for PayPal.  Please choose fewer invoices.');
        }
        const paypalSdkBaseUrl = baseUrl.replace(/\/apiv2$/, '');
        const response = await fetch(`${paypalSdkBaseUrl}/payments/paypal_sdk.php?call=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amountAfterPrepay.value.toFixed(2),
                currency: currency.value,
                items: paypalItems.value,
                custom: invoices.value.join(','),
                returnURL: `${window.location.origin}/pay/paypal/${invoices.value.join(',')}/done`,
                cancelURL: `${window.location.origin}/pay/paypal/${invoices.value.join(',')}/done`,
            }),
        });
        const orderData = await response.json();
        console.log('PayPal create order response:', orderData);
        if (orderData.id) {
            return orderData.id;
        } else if (orderData.error) {
            throw new Error(orderData.error);
        } else {
            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})` : JSON.stringify(orderData);
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('PayPal createOrder error:', error);
        resultMessage(`Could not initiate PayPal Checkout...<br><br>${error}`);
        throw error;
    }
}

async function onApproveCallback(data: any, actions: any) {
    try {
        const paypalSdkBaseUrl = baseUrl.replace(/\/apiv2$/, '');
        const response = await fetch(`${paypalSdkBaseUrl}/payments/paypal_sdk.php?call=capture&order=${data.orderID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const orderData = await response.json();
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message
        const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0] || orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        const errorDetail = orderData?.details?.[0];
        // this actions.restart() behavior only applies to the Buttons component
        if (errorDetail?.issue === 'INSTRUMENT_DECLINED' && !data.card && actions) {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
        } else if (errorDetail || !transaction || transaction.status === 'DECLINED') {
            // (2) Other non-recoverable errors -> Show a failure message
            let errorMessage;
            if (transaction) {
                errorMessage = `Transaction ${transaction.status}: ${transaction.id}`;
            } else if (errorDetail) {
                errorMessage = `${errorDetail.description} (${orderData.debug_id})`;
            } else {
                errorMessage = JSON.stringify(orderData);
            }
            throw new Error(errorMessage);
        } else {
            // (3) Successful transaction -> Show confirmation or thank you message
            // Or go to another URL:  actions.redirect('thank_you.html');
            resultMessage(`Transaction ${transaction.status}: ${transaction.id}<br><br>Payment successful! Redirecting...`);
            console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
            const customId = orderData.purchase_units[0].payments.captures[0].custom_id;
            window.location.href = `${window.location.origin}/payment_success?invoices=${customId}`;
        }
    } catch (error) {
        console.error(error);
        resultMessage(`Sorry, your transaction could not be processed...<br><br>${error}`);
    }
}

// Example function to show a result to the user. Your site's UI library can be used instead.
function resultMessage(message: string) {
    const container = document.querySelector('#result-message');
    if (!container) return;
    container.innerHTML = message;
}

function formattedCost(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.value,
    }).format(amount);
}

async function initializePayPalButtons() {
    if (!paypalLoaded.value || !(window as any).paypal) return;
    await nextTick();
    if (ppButtons.value?.close) {
        ppButtons.value.close();
    }
    ppButtons.value = (window as any).paypal.Buttons(getBtnOpts()) as PayPalButtonsInstance;
    await ppButtons.value.render('#paypal-button-container');
}

function loadPayPalSdk() {
    if (!paypalSdkUrl.value) return;
    // Remove existing script if reloading
    if (paypalScriptEl.value) {
        document.head.removeChild(paypalScriptEl.value);
        paypalScriptEl.value = null;
        paypalLoaded.value = false;
    }
    const script = document.createElement('script');
    script.src = paypalSdkUrl.value;
    script.setAttribute('data-page-type', 'checkout');
    script.setAttribute('data-sdk-integration-source', 'developer-studio');
    script.async = true;
    script.onload = () => {
        paypalLoaded.value = true;
        initializePayPalButtons();
    };
    document.head.appendChild(script);
    paypalScriptEl.value = script;
}

function deleteCardModal(cc_id = 0) {
    Swal.fire({
        icon: 'warning',
        title: '<h3>Delete CreditCard</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: `<p>Are you sure want to remove your creditcard <br><b>${data.value.ccs[cc_id]['cc']}</b> ?</p>`,
        preConfirm: () => {
            try {
                fetchWrapper.delete(`${baseUrl}/billing/creditcards/${cc_id}`).then((response) => {
                    console.log('delete cc success', response);
                    accountStore.load();
                });
            } catch (error: any) {
                console.log('delete cc failed', error);
            }
        },
    });
}

function addCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards`, {
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
                console.log('add cc success', response);
                accountStore.load();
                $('#add-card').modal('hide');
            });
    } catch (error: any) {
        console.log('add cc failed', error);
    }
}

async function editCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}`, {
                cc_exp: contFields.cc_exp,
            })
            .then((response) => {
                console.log('edit cc success', response);
                accountStore.load();
                $('#edit-card').modal('hide');
            });
    } catch (error: any) {
        console.log('edit cc failed', error);
    }
}

async function verifyCardSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}/verify`, {
                cc_ccv2: cc_ccv2.value,
            })
            .then((response) => {
                console.log('verify cc success', response);
                accountStore.load();
                $('#verify-card-1').modal('hide');
                // After step 1, the card is now charged - open step 2 modal
                if (data.value.ccs[modalCcIdx.value]) {
                    data.value.ccs[modalCcIdx.value].verify_charged = true;
                    $('#verify-card').modal('show');
                }
            });
    } catch (error: any) {
        console.log('verify cc failed', error);
    }
}

async function verifyAmountSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/billing/creditcards/${modalCcIdx.value}/verify`, {
                cc_amount1: cc_amount1.value,
                cc_amount2: cc_amount2.value,
            })
            .then((response) => {
                console.log('verify amounts success', response);
                accountStore.load();
                $('#verify-card').modal('hide');
            });
    } catch (error: any) {
        console.log('verify amounts failed', error);
    }
}

async function addCardModal() {
    for (let key in contFields) {
        contFields[key] = data.value[key] && key != 'cc' && key != 'cc_exp' ? data.value[key] : '';
    }
}

function editCardModal(cc_id = 0) {
    modalCcIdx.value = cc_id;
    for (let key in contFields) {
        if (data.value.ccs[modalCcIdx.value][key]) {
            contFields[key] = data.value.ccs[modalCcIdx.value][key];
        } else if (data.value[key]) {
            contFields[key] = data.value[key];
        } else {
            contFields[key] = '';
        }
    }
    $('#edit-card').modal('show');
}

async function verifyCard(cc_id = 0) {
    modalCcIdx.value = cc_id;
    if (!data.value.ccs[cc_id].verify_charged) {
        $('#verify-card-1').modal('show');
    } else {
        $('#verify-card').modal('show');
    }
}

async function updatePaymentMethod(cc_val: string, cc_auto_toggle = false) {
    try {
        if (cc_auto_toggle) {
            ccAuto.value = ccAuto.value === 1 ? 0 : 1;
            await fetchWrapper.post(`${baseUrl}/billing/payment_method`, {
                cc_auto: ccAuto.value,
            });
        } else {
            defaultPaymentMethod.value = cc_val;
            await fetchWrapper.post(`${baseUrl}/billing/payment_method`, {
                payment_method: cc_val,
            });
        }
    } catch (error: any) {
        console.log('update payment method failed', error);
    }
}



function selectPaymentMethod(method: string) {
    paymentMethod.value = method;
    nextTick(() => {
        const sectionId = method === 'cc' ? 'select_card' : 'select_paypal';
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    });
}

function paymentBtnClass(methodKey: string): string {
    const isSelected = paymentMethod.value === methodKey;
    return `btn btn-sm mx-1 payment-method-btn ${isSelected ? 'btn-outline-custom' : 'btn-custom'}`;
}

function checkStatus(status: string, field: 'invoices_module' | 'days_old' | 'service_status' | 'prepay_invoice', value: string | number, check: Operator = '==', toggleOther = false) {
    const isActive = toggleStatus.value[status] ?? false;
    const operatorFn = operators[check];
    const invoiceSet = new Set(invoices.value);
    for (const row of invrows.value) {
        const matches = operatorFn(row[field], value);
        if (!isActive) {
            if (matches) {
                invoiceSet.add(row.service_label);
            } else if (toggleOther) {
                invoiceSet.delete(row.service_label);
            }
        } else {
            if (matches) {
                invoiceSet.delete(row.service_label);
            } else if (toggleOther) {
                invoiceSet.add(row.service_label);
            }
        }
    }
    invoices.value = Array.from(invoiceSet);
    toggleStatus.value[status] = !isActive;
}

function checkRecent() {
    checkStatus('recent', 'days_old', 31, '<=', true);
}

function checkActive() {
    checkStatus('active', 'service_status', 'active', '==', true);
}

function checkClass(module: string) {
    checkStatus(module, 'invoices_module', module);
}

function checkAll() {
    checkStatus('all', 'prepay_invoice', 'undefined', 'typeof', true);
}

function uncheckAll() {
    invoices.value = [];
}

async function toggleCheckbox() {
    if (isChecked.value) {
        uncheckAll();
    } else {
        checkAll();
    }
}

async function delete_invoice(invId: number) {
    Swal.fire({
        icon: 'warning',
        title: '<h3>Invoice Delete ?</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it.',
        html: `'<p>Are you sure want to delete your invoice ${invId}?</p>`,
        preConfirm: () => {
            console.log('Wanted to delete invoice: ', invId);
            fetchWrapper
                .delete(`${baseUrl}/billing/invoices/${invId}`)
                .then((response) => {
                    console.log(response);
                    Swal.close();
                    console.log('Deleted Invoice ', invId);
                    Swal.fire({
                        icon: 'info',
                        html: `Got ${response}`,
                    });
                    loadCartData();
                })
                .catch((error: any) => {
                    Swal.close();
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        html: `Got error ${error.message}`,
                    });
                });
        },
    });
}

async function updateInfoSubmit() {
    try {
        console.log('posting contact fields:', contFields);
        const response = await fetchWrapper.post(`${baseUrl}/account`, contFields);
        console.log(response);
        for (let key in contFields) {
            data.value[key] = contFields[key];
        }
        $('#edit-info').modal('hide');
    } catch (error: any) {
        console.log(error);
    }
}

async function formatCardNum(e: any) {
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

async function formatExpDate(e: any) {
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

function onCardNumInput(e: any) {
    formatCardNum(e);
}

function onExpDateInput(e: any) {
    formatExpDate(e);
}

async function submitForm(value: any) {
    // If currency changed, persist it to the account first
    if (currency.value && data.value?.currency !== currency.value) {
        try {
            await fetchWrapper.post(`${baseUrl}/account`, { currency: currency.value });
            data.value.currency = currency.value;
        } catch (e: any) {
            console.log('currency update failed', e);
        }
    }
    loadCartData();
}

async function loadCountries() {
    try {
        fetchWrapper.get(`${baseUrl}/account/countries`).then((response) => {
            countries.value = response;
        });
    } catch (error: any) {
        console.log('error:', error);
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
        if (currency.value && currency.value !== 'USD') {
            params.set('currency', currency.value);
        }
        if (params.size > 0) {
            query = `?${params.toString()}`;
        }
        fetchWrapper.get(`${baseUrl}/billing/cart${query}`).then((response: CartResponse) => {
            let checkedInvoices: string[] = [];
            console.log(response);
            cartResponse.value = response;
            currencySymbol.value = response.currencySymbol;
            paymentMethodsData.value = response.paymentMethodsData;
            modules.value = response.modules;
            modulesCounts.value = response.modules_counts;
            prepayAvailable.value = Number(response.prepay);
            payssionMinAmount.value = Number(response.payssion_min || 0);
            ccAuto.value = Number(response.cc_auto || 0);
            currencyArr.value = response.currency_arr;
            invoiceDays.value = Number(response.invoice_days);
            /* invrows.value = response.invrows;
            total_invoices.value = Number(response.total_invoices);
            total.value = Number(response.total); */
            total_invoices.value = 0;
            total.value = 0;
            invrows.value = [];
            for (const idx in response.invrows) {
                let row = response.invrows[idx];
                if ((typeof routeInvoices.value == 'undefined' && typeof row.prepay_invoice == 'undefined') || (typeof routeInvoices.value != 'undefined' && (routeInvoices.value.includes(row.service_label) || routeInvoices.value.includes(String(row.invoices_id))))) {
                    total_invoices.value++;
                    total.value += Number(row.invoices_amount);
                    checkedInvoices.push(row.service_label);
                    invrows.value.push(row);
                }
            }
            console.log(checkedInvoices);
            invoices.value = checkedInvoices;
        });
    } catch (error: any) {
        console.log('error:', error);
    }
}

onMounted(() => {
    loadPayPalSdk();
    if (triggerClick.value) {
        $(`#unver_${current_cc_id.value}`).attr('data-step', triggerClick.value).trigger('click');
    }
});

// Prepay/regular invoice mutual exclusion: they cannot be paid together
watch(invoices, (newVal, oldVal) => {
    if (newVal.length === 0 || oldVal === undefined) return;
    // Find which invoice was just added
    const added = newVal.filter((v) => !oldVal.includes(v));
    if (added.length === 0) return;
    const addedRow = invrows.value.find((r) => added.includes(r.service_label));
    if (!addedRow) return;
    const addedIsPrepay = typeof addedRow.prepay_invoice !== 'undefined';
    // If a prepay invoice was added, remove all non-prepay; if regular was added, remove all prepay
    const filtered = newVal.filter((label) => {
        const row = invrows.value.find((r) => r.service_label === label);
        if (!row) return true;
        const isPrepay = typeof row.prepay_invoice !== 'undefined';
        return isPrepay === addedIsPrepay;
    });
    if (filtered.length !== newVal.length) {
        invoices.value = filtered;
    }
});

watch([() => data.value?.country, currency], ([country]) => {
    if (country) {
        loadPayPalSdk();
    }
});

// Re-render PayPal buttons when selected invoices change (amount changes)
watch(selectedAmount, () => {
    if (paypalLoaded.value && paymentMethod.value === 'paypal') {
        initializePayPalButtons();
    }
});

pageInit();
</script>

<template>
    <div v-if="order_msg" class="row justify-content-center mt-2">
        <div class="col-md-12">
            <div class="callout callout-success">
                <h5>{{ t('billing.cart.thankYouForOrder') }}</h5>
                <p class="text-md" v-html="order_msg"></p>
            </div>
        </div>
    </div>
    <div class="row justify-content-center mt-2">
        <div class="col-md-9">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="fas fa-money-bill"></i>&nbsp;{{ t('billing.cart.payBalance') }}</h3>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row my-2">
                        <div class="col-md-12">
                            <span class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">1</span>
                            <b class="text-lg">{{ t('billing.cart.billingAddress') }}</b>
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
                                    <b class="text-lg">{{ t('billing.cart.home') }}</b><br />
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
                                    <a href="javascript:void(0);" class="btn btn-custom btn-sm px-3 py-1" data-toggle="modal" data-target="#edit-info" :title="t('billing.cart.updateContactInfo')"> <i class="far fa-edit" aria-hidden="true"></i>&nbsp;{{ t('billing.cart.edit') }} </a>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card my-3 ml-5 px-4 py-3">
                            <div class="card-header">
                                <h5 class="card-title text-bold py-2">{{ t('billing.cart.addBillingAddressPrompt') }}</h5>
                            </div>
                            <div class="card-body mx-auto my-2">
                                <router-link to="/account/info" class="btn btn-custom px-3 py-2" :title="t('billing.cart.addBillingAddress')"> <i class="fas fa-plus"></i>&nbsp;{{ t('billing.cart.addBillingAddress') }} </router-link>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div class="row mt-5">
                        <div class="col-md-5 p-0">
                            <div class="col-md-12">
                                <span class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">2</span>
                                <b class="text-lg">{{ t('billing.cart.numberOfProducts') }}</b>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="invoice_days" class="col-md-4 col-form-label">{{ t('billing.cart.filter') }}</label>
                                    <select id="invoice_days" v-model="invoiceDays" class="col-md-8 select2 form-control text-left" name="invoice_days" @change="submitForm">
                                        <option value="-1">{{ t('billing.cart.allDays') }}</option>
                                        <option value="30">{{ t('billing.cart.thirtyDays') }}</option>
                                        <option value="60">{{ t('billing.cart.sixtyDays') }}</option>
                                        <option value="90">{{ t('billing.cart.ninetyDays') }}</option>
                                        <option value="365">{{ t('billing.cart.oneYear') }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="col-md-3 text-center">
                            <form @submit.prevent="submitForm('cart' + (st ? '?st=' + st : ''))">
                                <div class="form-group row">
                                    <label for="currency_select" class="col-md-6 col-form-label">{{ t('billing.cart.currency') }}</label>
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
                                    <th>{{ t('billing.cart.service') }}</th>
                                    <th>{{ t('billing.cart.description') }}</th>
                                    <th>{{ t('billing.cart.date') }}</th>
                                    <th>{{ t('billing.cart.serviceStatus') }}</th>
                                    <th>{{ t('billing.cart.actions') }}</th>
                                    <th class="text-right">{{ t('billing.cart.amount') }}</th>
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
                                    <td>
                                        {{ invrow.invoices_description }}
                                        <div class="form-text text-muted text-xs" v-html="getServerComment(invrow)" />
                                    </td>
                                    <td>{{ invrow.date }}</td>
                                    <td>{{ invrow.service_status }}</td>
                                    <td class="text-center">
                                        <template v-if="invrow.prepay_invoice || invrow.service_status === 'pending'">
                                            <a href="javascript:void(0);" title="Delete Invoice" @click="delete_invoice(invrow.invoices_id)"><i class="far fa-trash-alt"></i></a>
                                        </template>
                                        <template v-else>
                                            <span class="font-italic text-muted text-sm">{{ t('billing.cart.empty') }}</span>
                                        </template>
                                    </td>
                                    <td>{{ invrow.currency_display }}</td>
                                </tr>
                                <tr>
                                    <td>{{ t('billing.cart.filter') }}</td>
                                    <td colspan="7">
                                        <button type="button" class="btn bg-teal btn-sm mr-2 mb-1" @click="checkAll">{{ t('billing.cart.all') }}</button>
                                        <button type="button" class="btn bg-teal btn-sm mr-2 mb-1" @click="uncheckAll">{{ t('billing.cart.none') }}</button>
                                        <button type="button" class="btn bg-teal btn-sm mr-2 mb-1" @click="checkRecent">{{ t('billing.cart.pastMonth') }}</button>
                                        <button type="button" class="btn bg-teal btn-sm mr-2 mb-1" @click="checkActive">{{ t('billing.cart.active') }}</button>
                                        <button v-for="(count, module) in modulesCounts" :key="module" class="btn btn-sm bg-teal mr-2 mb-1" @click="checkClass(String(module))">
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
                                <b class="text-lg">{{ t('billing.cart.paymentOptions') }}</b>
                            </div>
                            <div class="col-md-12 b-radius mt-4 px-5 py-3" style="background: #f4f4f4">
                                <h5 class="text-bold text-md text-capitalize">{{ t('billing.cart.howToPay') }}</h5>
                                <span v-show="showMethods" id="payments-section">
                                    <template v-for="(methodData, methodId) in filteredPaymentMethods" :key="methodId">
                                        <a v-if="String(methodId) === 'cc' || methodData.text === 'Select Credit Card' || methodData.text === 'Credit Card'" :class="paymentBtnClass('cc')" :style="methodData.link_style" @click.prevent="selectPaymentMethod('cc')">{{ methodData.text }} <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" /></a>
                                        <template v-else-if="methodData.text == 'PayPal'">
                                            <a :class="paymentBtnClass('paypal')" :style="methodData.link_style" @click.prevent="selectPaymentMethod('paypal')">{{ methodData.text }} <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" /></a>
                                            <router-link :to="'/pay/' + methodId + '/' + invoices.join(',')" class="btn btn-custom btn-sm mx-1 payment-method-btn" :style="methodData.link_style">
                                                <div style="float: right">{{ methodData.text }}<br />(old)</div>
                                                <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" />
                                            </router-link>
                                        </template>
                                        <router-link v-else :to="'/pay/' + methodId + '/' + invoices.join(',')" :class="paymentBtnClass(String(methodId))" :style="methodData.link_style">{{ methodData.text }} <img alt="" :src="'https://my.interserver.net' + methodData.image" :style="methodData.image_style" /></router-link>
                                    </template>
                                    <router-link v-if="showPrepay" :to="'/pay/prepay/' + invoices.join(',')" class="btn btn-custom btn-sm mx-1">
                                        PrePay ({{ formattedCost(prepayAvailable) }})
                                    </router-link>
                                </span>
                            </div>
                        </div>
                        <hr />
                        <div id="select_paypal" :style="paypalMethodStyle">
                            <div class="row my-2">
                                <div class="col-md-12">
                                    <span id="step_4" class="text-bold mr-1 steps" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">4</span>
                                    <b class="text-lg">{{ t('billing.cart.selectPayPalType') }}</b>
                                </div>
                                <div class="col-md-12 d-flex mt-3">
                                    <div id="paypal-button-container" class="paypal-button-container" style="width: 300px; float: left"></div>
                                </div>
                                <div id="result-message" class="col-md-12 mt-2 text-danger"></div>
                            </div>
                        </div>
                        <div v-show="paymentMethod == 'cc'" id="select_card">
                            <div class="row my-2">
                                <div class="col-md-12">
                                    <span id="step_4" class="text-bold mr-1" style="border: 1px solid black; border-radius: 50%; padding: 6px 12px; font-size: 18px">4</span>
                                    <b class="text-lg">{{ t('billing.cart.selectAddCreditCard') }}</b>
                                    <a href="javascript:void(0);" class="btn btn-custom float-right" data-toggle="modal" data-target="#add-card" @click="addCardModal"><i class="fas fa-plus" aria-hidden="true"></i>&nbsp;{{ t('billing.cart.addNewCard') }}</a>
                                </div>
                                <div id="selectcardmsg" class="col-md-12 d-flex mt-3"></div>

                                <template v-if="data.ccs">
                                    <div v-for="(cc_detail, cc_id) in data.ccs" :key="cc_id" class="col-md-5 b-radius card ml-5 mt-4 p-4" style="border: 1px solid rgba(204, 204, 204, 0.397)" :style="primaryCc === Number(cc_id) ? 'background-color: rgba(204, 204, 204, 0.397);' : ''">
                                        <div v-if="primaryCc === Number(cc_id)" class="ribbon-wrapper">
                                            <div class="ribbon bg-success text-xs">{{ t('billing.cart.primary') }}</div>
                                        </div>
                                        <form id="paymentform" :action="'/pay/cc/' + invoices.join(',')" method="post">
                                            <input v-for="inv in invoices" :key="inv" type="hidden" name="inv_arr[]" :value="inv" />
                                            <input type="hidden" name="balance" value="1" />
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
                                                        <div class="text-muted text-sm">{{ t('billing.cart.expiresOn', { date: cc_detail.cc_exp }) }}</div>
                                                        <div class="my-2">
                                                            <template v-if="selectedCc === Number(cc_id)">
                                                                <input type="password" name="cc_ccv2" placeholder="cvv2" style="border-radius: 5px; width: 100%" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter Your CVV')" oninput="setCustomValidity('')" />
                                                            </template>
                                                            <template v-else> &nbsp; </template>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 pl-4">
                                                    <a v-if="cc_detail.verified_cc === 'no'" :id="'unver_' + cc_id" class="tn btn-outline-custom btn-xs ml-2 px-3 py-1" href="javascript:void(0);" style="text-decoration: none" :title="cc_detail.unverified_text" @click.prevent="verifyCard(Number(cc_id))"> <i class="fas fa-exclamation-triangle"></i>&nbsp;Verify</a>
                                                    <a v-else-if="cc_detail.verified_cc !== 'no' && selectedCc !== Number(cc_id)" :id="'editcard-modal-' + cc_id" class="btn btn-custom btn-sm ml-2 px-3 py-1" href="javascript:void(0);" :title="cc_detail.edit_text" data-toggle="modal" data-target="#edit-card" @click="editCardModal(Number(cc_id))"> <i class="far fa-edit" aria-hidden="true"></i>&nbsp;Edit</a>
                                                    <div v-else-if="selectedCc === Number(cc_id)" class="text-success text-lg" name="totalccamount"></div>
                                                </div>
                                                <div class="col-md-6 text-right">
                                                    <a v-if="(selectedCc !== Number(cc_id) || cc_detail.verified_cc === 'no') && paymentMethod === 'cc'" class="btn btn-outline-custom btn-xs px-3 py-1" href="javascript:void(0);" :title="cc_detail.delete_text" style="text-decoration: none" @click.prevent="deleteCardModal(Number(cc_id))"> <i class="fas fa-trash"></i>&nbsp;Delete</a>
                                                    <input v-else-if="selectedCc === Number(cc_id)" id="paynow" type="submit" class="btn btn-outline-custom btn-sm" style="border-radius: 5px" value="Pay Now" />
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </template>
                                <div v-else class="col-md-12 b-radius mt-4 px-5 py-3" style="background: #f4f4f4">
                                    <h5 class="text-bold text-md text-capitalize">{{ t('billing.cart.zeroCreditCards') }}</h5>
                                    <span class="text-red">{{ t('billing.cart.addCardPrompt') }}</span>
                                </div>
                                <div class="col-md-12 mt-4">
                                    <div class="card shadow-hover shadow-sm">
                                        <div class="card-body">
                                            <div class="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                                                <input id="ccAutoToggle" :checked="ccAuto === 1" type="checkbox" class="custom-control-input" @change="updatePaymentMethod('', true)" />
                                                <label class="custom-control-label" for="ccAutoToggle">{{ t('billing.cart.autoChargeCc') }}</label>
                                            </div>
                                        </div>
                                    </div>
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
                                            <input id="checkboxtoggle" v-model="isChecked" type="checkbox" name="uncheckAll" value="" @change="toggleCheckbox" />
                                            <label for="checkboxtoggle"> </label>
                                        </div>
                                    </th>
                                    <th>{{ t('billing.cart.service') }}</th>
                                    <th>{{ t('billing.cart.description') }}</th>
                                    <th>{{ t('billing.cart.date') }}</th>
                                    <th>{{ t('billing.cart.serviceStatus') }}</th>
                                    <th>{{ t('billing.cart.actions') }}</th>
                                    <th class="text-right">{{ t('billing.cart.amount') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="7" class="text-bold b-radius text-center text-black" style="background: #f4f4f4">
                                        <div class="callout callout-success m-0 p-3">
                                            <h5 class="text-success">{{ t('billing.cart.allUpToDate') }}</h5>
                                            <p class="mb-0">{{ t('billing.cart.noUnpaidInvoices') }}</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <div v-if="currency === 'INR'" class="col-md-12 alert alert-info b-radius mb-0 mt-4 text-sm">
                        <h4 class="text-bold text-capitalize text-lg">{{ t('billing.cart.manualBankPayment') }}</h4>
                        <p class="form-text m-0">
                            <b>Name:</b> {{ t('billing.cart.bankName') }}<br />
                            <b>Current A/C No:</b> {{ t('billing.cart.bankAccountNo') }}<br />
                            <b>IFSC Code:</b> {{ t('billing.cart.bankIfsc') }}<br />
                            {{ t('billing.cart.bankPaymentNote') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card cart-sidebar">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="fas fa-file-invoice"></i>&nbsp;{{ t('billing.cart.balanceInvoiceInfo') }}</h3>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table-sm table">
                        <tbody>
                            <tr>
                                <td class="text-center" colspan="2" style="border: none">
                                    <div><strong>{{ t('billing.cart.totalInvoices') }}</strong></div>
                                    <div class="text-success text-lg">{{ total_invoices }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <div><strong>{{ t('billing.cart.invoicesTotalAmount') }}</strong></div>
                                    <div class="text-success text-lg">{{ currencySymbol }}{{ total }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">
                                    <div><strong>{{ t('billing.cart.prepayAvailable') }}</strong></div>
                                    <div class="text-success text-lg">{{ formattedCost(prepayAvailable) }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <div><strong>{{ t('billing.cart.toBePaid') }}</strong></div>
                                    <div class="text-success text-lg">{{ formattedCost(amountAfterPrepay) }}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div id="edit-info" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.cart.updateContactInfo') }}</h4>
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
                                <input type="submit" :value="t('billing.cart.updateInfo')" class="btn btn-pay placeicon" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!--ADD CC FORM IN MODAL-->
    <div id="add-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.addCreditCard') }}</h4>
                </div>
                <div class="modal-body">
                    <form method="post" class="form-card" @submit.prevent="addCardSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="cr_no" v-model="contFields.cc" type="text" name="cc" placeholder="0000-0000-0000-0000" minlength="19" maxlength="19" required oninvalid="this.setCustomValidity('Please Enter valid 16 digit credit-card number')" @input="onCardNumInput" />
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" minlength="7" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" @input="onExpDateInput" />
                                            <label class="text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" required oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit-card number')" oninput="setCustomValidity('')" />
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
                                    <select v-model="contFields.country" name="country" class="form-control" style="padding-right: 5px; vertical-align: middle; float: right">
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
                            <div class="col-md-12"><input type="submit" value="Add Credit Card" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!--ADD CC FORM IN MODAL-->
    <!--EDIT CC FORM IN MODAL-->
    <div id="edit-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.updateCreditCard') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="EditForm" method="post" class="form-card" @submit.prevent="editCardSubmit">
                        <input id="e_cc_idx" v-model="modalCcIdx" type="hidden" name="idx" />
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input id="e_cr_no" v-model="contFields.cc" type="text" name="cc" required readonly disabled />
                                    <label class="text-md">Card Number</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="e_exp" v-model="contFields.cc_exp" type="text" name="cc_exp" placeholder="MM/YYYY" maxlength="7" required oninvalid="this.setCustomValidity('Please Enter expiry date on your card')" @input="onExpDateInput" />
                                            <label class="text-md">Expiry Date</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input id="ccv2" type="password" name="cc_ccv2" placeholder="&#9679;&#9679;&#9679;" minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter 3 digit CVV number on credit-card number')" oninput="setCustomValidity('')" disabled />
                                            <label class="text-md">CVV</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.name" type="text" name="name" placeholder="Name on card" disabled />
                                    <label class="text-md">Name</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="contFields.address" type="text" name="address" placeholder="Address line" disabled />
                                    <label class="text-md">Address</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.city" type="text" name="city" placeholder="City" disabled />
                                    <label class="text-md">City</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <input v-model="contFields.state" type="text" name="state" placeholder="State" disabled />
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
                                    <input v-model="contFields.zip" type="text" name="zip" placeholder="Zipcode" disabled />
                                    <label class="text-md">Zipcode</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" value="Update Card" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!--EDIT CC FORM IN MODAL-->
    <!-- VERIFY CC FORM -->
    <div id="verify-card-1" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.verification') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="VerifyForm" method="post" class="form-card" @submit.prevent="verifyCardSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <p>{{ t('billing.creditCard.verifyIntroStep1') }}</p>
                                <p>{{ t('billing.creditCard.verifyBillingStatement') }}</p>
                                <p>{{ t('billing.creditCard.verifyVoidNotice') }}</p>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="input-group">
                                    <input v-model="cc_ccv2" type="password" name="cc_ccv2" required minlength="3" maxlength="4" oninvalid="this.setCustomValidity('Please Enter three digit CVV / CSV number on your card')" oninput="setCustomValidity('')" />
                                    <label class="text-md">{{ t('billing.creditCard.securityCode') }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <input id="tos_checkbox" name="terms" value="1" class="form-check-input ml-2" type="checkbox" style="width: auto" required />
                                <label for="tos_checkbox" class="ml-4 pl-2"> {{ t('billing.creditCard.acceptTempCharges') }}</label>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" :value="t('billing.creditCard.sendAuthorization')" class="btn btn-pay placeicon" /></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- END VERIFY CC FORM -->
    <!-- VERIFY CC FORM -->
    <div id="verify-card" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 class="modal-title">{{ t('billing.creditCard.verification') }}</h4>
                </div>
                <div class="modal-body">
                    <form id="VerifyForm" method="post" class="form-card" @submit.prevent="verifyAmountSubmit">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <p>{{ t('billing.creditCard.verifyIntroStep1') }}</p>
                                <p>{{ t('billing.creditCard.verifyBankLogin') }}</p>
                                <p>{{ t('billing.creditCard.enterAmountsPrompt') }}</p>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input v-model="cc_amount1" type="text" name="cc_amount1" />
                                            <label class="text-md">{{ t('billing.creditCard.amount1') }}</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="input-group">
                                            <input v-model="cc_amount2" type="text" name="cc_amount2" />
                                            <label class="text-md">{{ t('billing.creditCard.amount2') }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-12"><input type="submit" :value="t('billing.creditCard.completeAuthorization')" class="btn btn-pay placeicon" /></div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12"><strong>{{ t('billing.creditCard.currencyNote') }}</strong></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.payment-method-btn {
    height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding-left: 1.25rem !important;
    padding-right: 1.25rem !important;
    font-weight: 800 !important;
    margin-right: 0.75rem !important;
    margin-bottom: 0.5rem;
}

.cart-sidebar {
    position: fixed;
    top: 30%;
    width: 22%;
}

@media (max-width: 800px) {
    .cart-sidebar {
        position: static;
        width: 100%;
    }

    .table-responsive-cart {
        overflow-x: auto;
    }

    .payment-methods-wrap {
        overflow-x: auto;
    }

    .cc-card-offset {
        margin-left: 0 !important;
    }
}

@media (max-width: 1200px) {
    .cart-sidebar {
        position: static;
        width: 100%;
    }
}
</style>
