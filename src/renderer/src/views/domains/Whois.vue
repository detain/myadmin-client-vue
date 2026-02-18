<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
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
const module: string = 'domains';
const currencySymbol = ref('$');
const available = ref(true);
const whoisCost = ref(0);

function placeOrder() {
    // Handle the form submission
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`, {}).then((response) => {
            Swal.close();
            console.log('domain whois privacy', response);
            Swal.fire({
                icon: 'success',
                html: `Success${response.text}`,
            });
        });
    } catch (error: any) {
        Swal.close();
        console.log('domain whois privacy', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function loadWhois() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/whois`).then((response) => {
            Swal.close();
            console.log('domain whois privacy', response);
            available.value = response.available;
            whoisCost.value = response.cost;
        });
    } catch (error: any) {
        Swal.close();
        console.log('domain whois privacy', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

loadWhois();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="w-100 b-radius mb-4 bg-white p-3" :style="{ 'border-left': '4px solid greenyellow' }">
                <p class="text-md m-0">
                    <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp;<b>Note:</b> &nbsp;Whois Privacy gets renewed every <b>12 months</b> from the date of activation. Whois Privacy Addon renewal cost is <b>{{ currencySymbol }}{{ whoisCost.toFixed(2) }}</b
                    >.
                </p>
            </div>
        </div>
    </div>
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
                    <p>Contact Privacy hides the identity of a Registrant when a user does a WHOIS lookup on that Registrant’s domain.</p>
                    <p>The benefit of having Contact Privacy is that the Registrant’s identity, including home address, phone number, and email address, is shielded from spammers, identity thieves and scammers.</p>
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

<style scoped></style>
