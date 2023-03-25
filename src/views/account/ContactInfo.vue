<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        csrf_token: {
            type: String,
            required: true
        },
        gravatar: {
            type: String,
            required: true
        },
        countries: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const formattedName = computed(() => props.data.name | htmlspecial);
        function submitForm() {
            // handle form submission
        }

        const specialChars = (text) => {
            return encodeURIComponent(text);
        };

        const data = ref({
            name: "",
            account_id: "",
            country: "",
            zip: "",
            disable_reinstall: false
        });
        const gravatar = ref(
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        );
        const csrf_token = ref("");
        const countries = ref({
            US: "United States",
            CA: "Canada",
            MX: "Mexico"
        });
        // Compute the value for the "zip" input based on the data.zip value
        const zipValue = computed(() => {
            if (data.value.zip) {
                return htmlspecial(data.value.zip);
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

        return {
            formattedName,
            submitForm,
            gravatar,
            data,
            csrf_token,
            countries,
            escape,
            submitForm
        };
    }
};
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-12">
        <div class="callout callout-danger text-red text-sm">
            <i class="fa fa-bullhorn">&nbsp;</i>
            <strong>Heads up!&nbsp;</strong>Although this information is optional, providing (accurate)
            information will help both enrich our interactions and lower your
            <strong>Risk % Score</strong>
            giving your quicker and more convenient access to parts of the site (such as not having to
            authenticate a credit-card).
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
                            <img :src="gravatar" class="avatar rounded-circle img-thumbnail" alt="avatar" :style="{ borderRadius: '10% !important', maxWidth: '250px' }">
                        </div>
                        <h4 class="mb-2 text-center">{{ specialChars(data.name) }}&nbsp;({{ data.account_id }})</h4>
                        <h4 class="mb-2 text-center">{{ data.account_lid }}</h4>
                    </div>
                    <div class="col">
                        <form @submit.prevent="submitForm">
                            <h4 class="mb-4">Personal Information</h4>
                            <input type="hidden" name="csrf_token" :value="csrf_token">

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="name">Name</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="name" id="name" :value="data.name" placeholder="Joe Cool" required autofocus="autofocus">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="company">Company</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="company" id="company" :value="data.company" placeholder="Company" required>
                                </div>
                            </div>

                            <div class="form-group row" :style="{ display: data.country === 'IN' ? 'flex' : 'none' }">
                                <label class="col-md-3 col-form-label" for="company">GSTIN</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="gstin" id="gstin" :value="data.gstin" placeholder="Goods and Services Taxpayer Identification Number">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="address">Address Line 1</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="address" id="address" :value="data.address" placeholder="Address Line 1" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="address2">Address Line 2</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="address2" id="address2" value="data['address2']" placeholder="Address Line 2">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="city">City, State</label>
                                <div class="col-md-3">
                                    <input type="text" class="form-control form-control-sm" name="city" id="city" :value="data.city" placeholder="City" required>
                                </div>
                                <div class="col-md-3">
                                    <input type="text" class="form-control form-control-sm" name="state" id="state" :value="data.state" placeholder="State" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="">Country</label>
                                <div class="col-md-6">
                                    <select name="country" class="form-control select2 form-control-sm" v-model="data.country">
                                        <option v-for="(country_name, country_code) in countries" :value="country_code" :selected="data.country === country_code">{{ country_name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="zip">Zipcode</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="zip" id="zip" :value="specialChars(data.zip)" placeholder="Zipcode" required>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="phone">Phone No</label>
                                <div class="col-md-6">
                                    <input type="text" class="form-control form-control-sm" name="phone" id="phone" :value="specialChars(data.phone)" placeholder="Phone Number" required>
                                </div>
                            </div>
                            <hr>
                            <h4 class="mb-4">Other Settings</h4>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_reset" type="checkbox" name="disable_reset" :value="1" v-model="data.disable_reset">
                                        <label for="disable_reset">Disable (Forgot your Password) Password Resets.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_email_notifications" type="checkbox" name="disable_email_notifications" :value="1" v-model="data.disable_email_notifications">
                                        <label for="disable_email_notifications">Disable Invoice Reminder Email Notifications.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_server_notifications" type="checkbox" name="disable_server_notifications" :value="1" v-model="data.disable_server_notifications" {/if}>
                                        <label for="disable_server_notifications">Disable Server Invoice Reminder Email Notifications.</label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label"></label>
                                <div class="col-md-8">
                                    <div class="icheck-success d-inline">
                                        <input id="disable_reinstall" type="checkbox" name="disable_reinstall" value="1" :checked="data.disable_reinstall">
                                        <label for="disable_reinstall">Disable Reinstalls.</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="email_invoices">Alternate Email for Invoices</label>
                                <div class="col-md-6">
                                    <input type="email" class="form-control form-control-sm" name="email_invoices" id="email_invoices" placeholder="Alternative email for sending invoices" value="{if isset($data.email_invoices)}{$data.email_invoices|htmlspecial}{/if}">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="email_abuse">Alternate Email for Abuse Reports</label>
                                <div class="col-md-6">
                                    <input type="email" class="form-control form-control-sm" name="email_abuse" id="email_abuse" placeholder="Alternate Email for Abuse Reports" value="{if isset($data.email_abuse)}{$data.email_abuse|htmlspecial}{/if}">
                                </div>
                            </div>

                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="save_settings">&nbsp;</label>
                                <div class="controls col-md-6">
                                    <button id="save_settings" type="submit" name="Submit" class="btn btn-custom btn-sm">Update Info</button>
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

