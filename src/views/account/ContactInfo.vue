<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';

import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAccountStore } from '@/stores/account.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertStore } from '@/stores/alert.store';
import { useSiteStore } from '@/stores/site.store';

const siteStore = useSiteStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);
const { loading, error, custid, ima, data, ip, gravatar } = storeToRefs(accountStore);
const timezones = ref<string[]>([]);
siteStore.setPageHeading('Contact Info');
siteStore.setTitle('Contact Info');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Contact Info'],
]);
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const countries = ref({});
async function onSubmit(values: any) {
    try {
        let message;
        const response = await fetchWrapper.post(`${baseUrl}/account`, {
            name: data.value.name,
            company: data.value.company,
            address: data.value.address,
            address2: data.value.address2,
            city: data.value.city,
            state: data.value.state,
            country: data.value.country,
            zip: data.value.zip,
            phone: data.value.phone,
            timezone: data.value.timezone,
            email_invoices: data.value.email_invoices,
            email_abuse: data.value.email_abuse,
            gstin: data.value.gstin,
            disable_email_notifications: data.value.disable_email_notifications,
            disable_reset: data.value.disable_reset,
            disable_server_notifications: data.value.disable_server_notifications,
            disable_reinstall: data.value.disable_reinstall,
        });
        console.log(response);
        /*
        if (user) {
            await usersStore.update(user.value.id, values)
            message = 'User updated';
        } else {
            await usersStore.register(values);
            message = 'User added';
        }
        await router.push('/users');
        alertStore.success(message);
        */
    } catch (error: any) {
        console.log(error);
        //alertStore.error(error);
    }
}

async function loadCountries() {
    try {
        await fetchWrapper.get(`${baseUrl}/account/countries`).then((response) => {
            countries.value = response;
        });
    } catch (error: any) {
        console.log('error loading countries:', error);
    }
}

async function loadTimezones() {
    try {
        await fetchWrapper.get(`${baseUrl}/account/timezones`).then((response) => {
            timezones.value = response;
        });
    } catch (error: any) {
        console.log('error loading timezones:', error);
    }
}

accountStore.load();
loadCountries();
loadTimezones();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="callout callout-danger text-red text-sm"><i class="fa fa-bullhorn">&nbsp;</i><strong>Heads up!&nbsp;</strong>Although this information is optional, providing (accurate) information will help both enrich our interactions and lower your <strong>Risk % Score</strong> giving your quicker and more convenient access to parts of the site (such as not having to authenticate a credit-card).</div>
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="fa fa-id-card-o"></i>&nbsp;Update Contact Info</h3>
                        <div class="card-tools float-right">
                            <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                <i class="fas fa-minus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-4 text-center">
                                <img :src="user.gravatar" class="avatar rounded-circle img-thumbnail" alt="avatar" style="border-radius: 10% !important; max-width: 250px; display: inline;" />
                            </div>
                            <h4 class="mb-2 text-center">{{ data.name }}&nbsp;({{ data.account_id }})</h4>
                            <h4 class="mb-2 text-center">{{ data.account_lid }}</h4>
                        </div>
                        <div class="col">
                            <form method="POST" @submit.prevent="onSubmit">
                                <h4 class="mb-4">Personal Information</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="name">Name</label>
                                    <div class="col-md-6">
                                        <input id="name" v-model="data.name" type="text" class="form-control form-control-sm" name="name" placeholder="Joe Cool" required autofocus />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="company">Company</label>
                                    <div class="col-md-6">
                                        <input id="company" v-model="data.company" type="text" class="form-control form-control-sm" name="company" placeholder="Company" required />
                                    </div>
                                </div>
                                <div v-if="data.country === 'IN'" class="form-group row" style="display: flex">
                                    <label class="col-md-3 col-form-label" for="gstin">GSTIN TAX ID</label>
                                    <div class="col-md-6">
                                        <input id="gstin" v-model="data.gstin" type="text" class="form-control form-control-sm" name="gstin" placeholder="Goods and Services Taxpayer Identification Number" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address">Address Line 1</label>
                                    <div class="col-md-6">
                                        <input id="address" v-model="data.address" type="text" class="form-control form-control-sm" name="address" placeholder="Address Line 1" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address2">Address Line 2</label>
                                    <div class="col-md-6">
                                        <input id="address2" v-model="data.address2" type="text" class="form-control form-control-sm" name="address2" placeholder="Address Line 2" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="city">City, State</label>
                                    <div class="col-md-3">
                                        <input id="city" v-model="data.city" type="text" class="form-control form-control-sm" name="city" placeholder="City" required />
                                    </div>
                                    <div class="col-md-3">
                                        <input id="state" v-model="data.state" type="text" class="form-control form-control-sm" name="state" placeholder="State" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="country">Country</label>
                                    <div class="col-md-6">
                                        <select id="country" v-model="data.country" name="country" class="form-control select2 form-control-sm">
                                            <option v-for="(country_name, country_code) in countries" :key="country_code" :value="country_code" :selected="data.country === country_code">
                                                {{ country_name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="zip">Zipcode</label>
                                    <div class="col-md-6">
                                        <input id="zip" v-model="data.zip" type="text" class="form-control form-control-sm" name="zip" placeholder="Zipcode" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="phone">Phone No</label>
                                    <div class="col-md-6">
                                        <input id="phone" v-model="data.phone" type="text" class="form-control form-control-sm" name="phone" placeholder="Phone Number" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="timezone">Time Zone</label>
                                    <div class="col-md-6">
                                        <select id="timezone" v-model="data.timezone" name="timezone" class="form-control select2 form-control-sm">
                                            <option v-for="(zone, index) in timezones" :key="index" :value="zone">{{ zone }}</option>
                                        </select>
                                    </div>
                                </div>
                                <hr />
                                <h4 class="mb-4">Other Settings</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_reset"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_reset" v-model="data.disable_reset" type="checkbox" name="disable_reset" value="1" />
                                            <label for="disable_reset">Disable (Forgot your Password) Password Resets.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_email_notifications"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_email_notifications" v-model="data.disable_email_notifications" type="checkbox" name="disable_email_notifications" value="1" />
                                            <label for="disable_email_notifications">Disable Invoice Reminder Email Notifications.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_server_notifications"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_server_notifications" v-model="data.disable_server_notifications" type="checkbox" value="1" />
                                            <label for="disable_server_notifications">Disable Server Invoice Reminder Email Notifications.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_reinstall"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_reinstall" v-model="data.disable_reinstall" type="checkbox" value="1" />
                                            <label for="disable_reinstall">Disable Reinstalls.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_invoices">Alternate Email for Invoices</label>
                                    <div class="col-md-6">
                                        <input id="email_invoices" v-model="data.email_invoices" type="email" class="form-control form-control-sm" name="email_invoices" placeholder="Alternative email for sending invoices" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_abuse">Alternate Email for Abuse Reports</label>
                                    <div class="col-md-6">
                                        <input id="email_abuse" v-model="data.email_abuse" type="email" class="form-control form-control-sm" name="email_abuse" placeholder="Alternate Email for Abuse Reports" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="save_settings">&nbsp;</label>
                                    <div class="controls col-md-6">
                                        <input id="save_settings" type="submit" name="Submit" value="Update Info" class="btn btn-custom btn-sm" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
