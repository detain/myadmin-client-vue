<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAccountStore, useAuthStore, useAlertStore, useSiteStore } from '@/stores';
const siteStore = useSiteStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading, gravatar } = storeToRefs(siteStore);
const { loading, error, custid, ima, csrf_token, link, data, ip } = storeToRefs(accountStore);
siteStore.setPageHeading('Contact Info');
siteStore.setTitle('Contact Info');
siteStore.setBreadcrums({ '/home': 'Home', '': 'Contact Info' });
const baseUrl = siteStore.getBaseUrl();
const route = useRoute();
const countries = ref({});
async function onSubmit(values) {
    try {
        let message;
        const response = await fetchWrapper.post(baseUrl + '/account', {
            name: data.value.name,
            company: data.value.company,
            address: data.value.address,
            address2: data.value.address2,
            city: data.value.city,
            state: data.value.state,
            country: data.value.country,
            zip: data.value.zip,
            phone: data.value.phone,
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
    } catch (error) {
        console.log(error);
        //alertStore.error(error);
    }
}

try {
    fetchWrapper.get(baseUrl + '/account/countries').then((response) => {
        countries.value = response;
    });
} catch (error) {
    console.log('error:');
    console.log(error);
}
accountStore.load();
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
                                <img :src="user.gravatar" class="avatar rounded-circle img-thumbnail" alt="avatar" style="border-radius: 10% !important; max-width: 250px" />
                            </div>
                            <h4 class="mb-2 text-center">{{ data.name }}&nbsp;({{ data.account_id }})</h4>
                            <h4 class="mb-2 text-center">{{ data.account_lid }}</h4>
                        </div>
                        <div class="col">
                            <form @submit.prevent="onSubmit" method="POST" action="contact_info">
                                <h4 class="mb-4">Personal Information</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="name">Name</label>
                                    <div class="col-md-6">
                                        <input v-model="data.name" type="text" class="form-control form-control-sm" name="name" id="name" placeholder="Joe Cool" required autofocus />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="company">Company</label>
                                    <div class="col-md-6">
                                        <input v-model="data.company" type="text" class="form-control form-control-sm" name="company" id="company" placeholder="Company" required />
                                    </div>
                                </div>
                                <div v-if="data.country === 'IN'" class="form-group row" style="display: flex">
                                    <label class="col-md-3 col-form-label" for="company">GSTIN</label>
                                    <div class="col-md-6">
                                        <input v-model="data.gstin" type="text" class="form-control form-control-sm" name="gstin" id="gstin" placeholder="Goods and Services Taxpayer Identification Number" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address">Address Line 1</label>
                                    <div class="col-md-6">
                                        <input v-model="data.address" type="text" class="form-control form-control-sm" name="address" id="address" placeholder="Address Line 1" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address2">Address Line 2</label>
                                    <div class="col-md-6">
                                        <input v-model="data.address2" type="text" class="form-control form-control-sm" name="address2" id="address2" placeholder="Address Line 2" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="city">City, State</label>
                                    <div class="col-md-3">
                                        <input v-model="data.city" type="text" class="form-control form-control-sm" name="city" id="city" placeholder="City" required />
                                    </div>
                                    <div class="col-md-3">
                                        <input v-model="data.state" type="text" class="form-control form-control-sm" name="state" id="state" placeholder="State" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="">Country</label>
                                    <div class="col-md-6">
                                        <select v-model="data.country" id="country" name="country" class="form-control select2 form-control-sm">
                                            <option v-for="(country_name, country_code) in countries" :key="country_code" :value="country_code" :selected="data.country === country_code">
                                                {{ country_name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="zip">Zipcode</label>
                                    <div class="col-md-6">
                                        <input v-model="data.zip" type="text" class="form-control form-control-sm" name="zip" id="zip" placeholder="Zipcode" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="phone">Phone No</label>
                                    <div class="col-md-6">
                                        <input v-model="data.phone" type="text" class="form-control form-control-sm" name="phone" id="phone" placeholder="Phone Number" required />
                                    </div>
                                </div>
                                <hr />
                                <h4 class="mb-4">Other Settings</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input v-model="data.disable_reset" id="disable_reset" type="checkbox" name="disable_reset == 1" value="1" />
                                            <label for="disable_reset">Disable (Forgot your Password) Password Resets.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input v-model="data.disable_email_notifications" id="disable_email_notifications" type="checkbox" name="disable_email_notifications == 1" value="1" />
                                            <label for="disable_email_notifications">Disable Invoice Reminder Email Notifications.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_server_notifications" type="checkbox" v-model="data.disable_server_notifications" :checked="data.disable_server_notifications == 1" value="1" />
                                            <label for="disable_server_notifications">Disable Server Invoice Reminder Email Notifications.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_reinstall" type="checkbox" v-model="data.disable_reinstall" :checked="data.disable_reinstall == 1" value="1" />
                                            <label for="disable_reinstall">Disable Reinstalls.</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_invoices">Alternate Email for Invoices</label>
                                    <div class="col-md-6">
                                        <input type="email" class="form-control form-control-sm" name="email_invoices" id="email_invoices" placeholder="Alternative email for sending invoices" v-model="data.email_invoices" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_abuse">Alternate Email for Abuse Reports</label>
                                    <div class="col-md-6">
                                        <input type="email" class="form-control form-control-sm" name="email_abuse" id="email_abuse" placeholder="Alternate Email for Abuse Reports" v-model="data.email_abuse" />
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
