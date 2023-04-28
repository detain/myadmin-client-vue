<script setup>
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers';
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore, useAlertStore, useLayoutStore } from '@/stores';

const alertStore = useAlertStore();
const authStore = useAuthStore();
const layoutStore = useLayoutStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading, gravatar } = storeToRefs(layoutStore);

layoutStore.setPageHeading('Contact Info');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Contact Info'});

async function onSubmit(values) {
    try {
        let message;
        const response = await fetchWrapper.post('https://mystage.interserver.net/apiv2/contact_info', {
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
            disable_reinstall: data.value.disable_reinstall
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

const specialChars = (text) => {
    return encodeURIComponent(text);
};
const data = ref({
    name: "",
    account_id: "",
    account_lid: "",
    company: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    phone: "",
    email_invoices: "",
    email_abuse: "",
    gstin: "",
    disable_email_notifications: false,
    disable_reset: false,
    disable_server_notifications: false,
    disable_reinstall: false
});
const countries = ref({
    US: "United States",
    CA: "Canada",
    MX: "Mexico"
});
// Compute the value for the "zip" input based on the data.zip value
const zipValue = computed(() => {
    if (data.value.zip) {
        return data.value.zip;
    } else {
        return "";
    }
});
const route = useRoute();

const escape = (str) => {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
};

const loadContactInfo = async (data,gravatar,countries) => {
    try {
        const response = await fetchWrapper.get('https://mystage.interserver.net/apiv2/contact_info');
        console.log('api success');
        console.log(response);
        data.value = {
            name: response.data.name,
            account_id: response.data.account_id,
            account_lid: response.data.account_lid,
            company: response.data.company,
            address: response.data.address,
            address2: response.data.address2,
            city: response.data.city,
            state: response.data.state,
            country: response.data.country,
            zip: response.data.zip,
            phone: response.data.phone,
            email_invoices: response.data.email_invoices,
            email_abuse: response.data.email_abuse,
            gstin: response.data.gstin,
            disable_email_notifications: response.data.disable_email_notifications,
            disable_reset: response.data.disable_reset,
            disable_server_notifications: response.data.disable_server_notifications,
            disable_reinstall: response.data.disable_reinstall
        };
        countries.value = response.countries;
        //gravatar.value = response.gravatar;
    } catch (error) {
        console.log('api failed');
        console.log(error);
    }
};

loadContactInfo(data,gravatar,countries)
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-12">
        <div class="callout callout-danger text-red text-sm">
            <i class="fa fa-bullhorn">&nbsp;</i><strong>Heads up!&nbsp;</strong>Although this information is optional, providing (accurate) information will help both enrich our interactions and lower your <strong>Risk % Score</strong> giving your quicker and more convenient access to parts of the site (such as not having to authenticate a credit-card).
        </div>
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2 float-left">
                        <i class="fa fa-id-card-o"></i>&nbsp;Update Contact Info
                    </h3>
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
                        <div class="text-center mb-4">
                            <img :src="user.gravatar" class="avatar rounded-circle img-thumbnail" alt="avatar" style="border-radius: 10%!important; max-width: 250px;" />
                        </div>
                        <h4 class="mb-2 text-center">{{ data.name }}&nbsp;({{ data.account_id }})</h4>
                        <h4 class="mb-2 text-center">{{ data.account_lid }}</h4>
                    </div>
                    <div class="col">
                        <form @submit.prevent="onSubmit" method="POST" action="contact_info">
                            <h4 class="mb-4">Personal Information</h4>
                            <input type="hidden" name="csrf_token" :value="csrf_token" />
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
                            <div v-if="data.country === 'IN'" class="form-group row" style="display:flex;">
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
                                    <input v-model="data.city" type="text" class="form-control form-control-sm" name="city" id="city" placeholder="City" required>
                                </div>
                                <div class="col-md-3">
                                    <input v-model="data.state" type="text" class="form-control form-control-sm" name="state" id="state" placeholder="State" required>
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
                                    <input v-model="data.zip" type="text" class="form-control form-control-sm" name="zip" id="zip" placeholder="Zipcode" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="phone">Phone No</label>
                                <div class="col-md-6">
                                    <input v-model="data.phone" type="text" class="form-control form-control-sm" name="phone" id="phone" placeholder="Phone Number" required>
                                </div>
                            </div>
                            <hr>
                            <h4 class="mb-4">Other Settings</h4>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input v-model="data.disable_reset" id="disable_reset" type="checkbox" name="disable_reset == 1" value="1">
                                        <label for="disable_reset">Disable (Forgot your Password) Password Resets.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input v-model="data.disable_email_notifications" id="disable_email_notifications" type="checkbox" name="disable_email_notifications == 1" value="1">
                                        <label for="disable_email_notifications">Disable Invoice Reminder Email Notifications.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_server_notifications" type="checkbox" v-model="data.disable_server_notifications" :checked="data.disable_server_notifications == 1" value="1">
                                        <label for="disable_server_notifications">Disable Server Invoice Reminder Email Notifications.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_reinstall" type="checkbox" v-model="data.disable_reinstall" :checked="data.disable_reinstall == 1" value="1">
                                        <label for="disable_reinstall">Disable Reinstalls.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="email_invoices">Alternate Email for Invoices</label>
                                <div class="col-md-6">
                                    <input type="email" class="form-control form-control-sm" name="email_invoices" id="email_invoices" placeholder="Alternative email for sending invoices" v-model="data.email_invoices">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="email_abuse">Alternate Email for Abuse Reports</label>
                                <div class="col-md-6">
                                    <input type="email" class="form-control form-control-sm" name="email_abuse" id="email_abuse" placeholder="Alternate Email for Abuse Reports" v-model="data.email_abuse">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="save_settings">&nbsp;</label>
                                <div class="controls col-md-6">
                                    <input id="save_settings" type="submit" name="Submit" value="Update Info" class="btn btn-custom btn-sm">
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

