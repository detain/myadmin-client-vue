<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    id: number;
    hostname: string;
}>();
const id = computed(() => props.id);
const hostname = computed(() => props.hostname);
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();
const module: string = 'domains';
const currencySymbol = ref('$');
const available = ref(true);
const whoisCost = ref(0);
const whoisPrivacy = ref('disabled');
const loadingDone = ref(false);

function placeOrder() {
    Swal.fire({
        title: 'Confirm Order',
        html: `<p>Whois Privacy cost: <b>${currencySymbol.value}${whoisCost.value.toFixed(2)}</b> per year</p><p>Are you sure you want to place this order?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Place Order',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fas fa-spinner fa-pulse"></i> Placing order...',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'order' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Order Placed',
                        html: response.text || 'Whois privacy order placed successfully!',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        if (response.payUrl) {
                            window.location.href = response.payUrl;
                        } else {
                            router.push(`/${moduleLink(module)}/${id.value}`);
                        }
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: error?.text || error?.error || 'Failed to place order.',
                    });
                });
        }
    });
}

function enableWhois() {
    Swal.fire({
        title: 'Enable Whois Privacy',
        html: `<p>Your domain <b>${hostname.value}</b> has a paid whois privacy addon that is not yet enabled.</p><p>Would you like to enable it now?</p>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Enable Whois Privacy',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fas fa-spinner fa-pulse"></i> Enabling whois privacy...',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'enable' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Enabled',
                        html: response.text || 'Whois Privacy is now enabled.',
                    }).then(() => {
                        router.push(`/${moduleLink(module)}/${id.value}`);
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: error?.text || error?.error || 'Failed to enable whois privacy.',
                    });
                });
        }
    });
}

function disableWhois() {
    Swal.fire({
        title: 'Disable & Cancel Whois Privacy',
        html: `<p>Your domain <b>${hostname.value}</b> Whois Privacy addon is currently enabled.</p><p>Are you sure you want to disable and cancel it?</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Disable & Cancel',
        confirmButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fas fa-spinner fa-pulse"></i> Disabling whois privacy...',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, { action: 'disableCancel' })
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Disabled',
                        html: response.text || 'Whois Privacy has been disabled and canceled.',
                    }).then(() => {
                        router.push(`/${moduleLink(module)}/${id.value}`);
                    });
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: error?.text || error?.error || 'Failed to disable whois privacy.',
                    });
                });
        }
    });
}

function loadWhois() {
    Swal.fire({
        title: '',
        html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`)
        .then((response) => {
            Swal.close();
            available.value = response.available;
            whoisCost.value = response.cost;
            currencySymbol.value = response.currencySymbol || '$';
            whoisPrivacy.value = response.whoisPrivacy || 'disabled';
            loadingDone.value = true;
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load whois privacy info.',
            });
            loadingDone.value = true;
        });
}

loadWhois();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="w-100 b-radius mb-4 bg-white p-3" :style="{ 'border-left': '4px solid greenyellow' }">
                <p class="text-md m-0">
                    <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp; <b>Note:</b> &nbsp;Whois Privacy gets renewed every <b>12 months</b> from the date of activation. Whois Privacy Addon renewal cost is <b>{{ currencySymbol }}{{ whoisCost.toFixed(2) }}</b>
                </p>
            </div>
        </div>
    </div>
    <template v-if="!available && loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>&nbsp; Whois Privacy is not available for this TLD.
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="whoisPrivacy === 'enabled' && loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card b-radius">
                    <div class="card-header">
                        <h3 class="card-title text-lg"><i class="fas fa-user-secret">&nbsp;</i>Whois Privacy</h3>
                        <div class="card-tools m-0">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
                        </div>
                    </div>
                    <div class="card-body text-center">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>&nbsp; Whois Privacy is currently <b>enabled</b> for <b>{{ hostname }}</b>.
                        </div>
                        <button class="btn btn-danger mt-3" @click="disableWhois">
                            <i class="fas fa-times-circle"></i>&nbsp; Disable & Cancel Whois Privacy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else-if="loadingDone">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card b-radius">
                    <div class="card-header">
                        <h3 class="card-title text-lg"><i class="fas fa-address-card">&nbsp;</i>Whois Privacy</h3>
                        <div class="card-tools m-0">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="placeOrder">
                            <div class="form-group row">
                                <label class="col-md-2 col-form-label" for="hostname">Domain</label>
                                <div class="col-sm-10 input-group"><input id="hostname" type="text" class="form-control form-control-sm" :value="hostname" disabled /></div>
                            </div>
                            <div id="whois_row" class="form-group row">
                                <label class="col-md-2 col-form-label" for="whois_cost">Whois Cost</label>
                                <div class="col-sm-10 input-group input-group-sm">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                                    </div>
                                    <input id="whois_cost" type="text" class="form-control form-control-sm" :value="whoisCost.toFixed(2)" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-2 col-form-label" for="submit"></label>
                                <div class="col-sm-10 input-group input-group-sm">
                                    <input id="button-id-signup" type="submit" name="Submit" value="Place Order" class="btn btn-custom btn-sm px-3 py-2 text-sm" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title text-lg"><i class="fas fa-user-secret">&nbsp;</i>Contact Privacy</h4>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>Contact Privacy hides the identity of a Registrant when a user does a WHOIS lookup on that Registrant's domain.</p>
                        <p>The benefit of having Contact Privacy is that the Registrant's identity, including home address, phone number, and email address, is shielded from spammers, identity thieves and scammers.</p>
                        <p>When Registrants enable the Contact Privacy service, masked contact information appears in the public WHOIS database.</p>
                        <p>
                            Contact privacy is available for <span class="text-md text-green text-md">{{ currencySymbol }}{{ whoisCost.toFixed(2) }}</span> per domain per year.
                        </p>
                        <p>To enable Contact Privacy for your Domain, Place Order Now.</p>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<style scoped></style>
