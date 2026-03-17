<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account.store';
import { useAuthStore } from '@/stores/auth.store';
import { useAlertStore } from '@/stores/alert.store';
import { useSiteStore } from '@/stores/site.store';
import { defaultLocale, loadLocaleMessages, resolveAppLocale, setAppLocale } from '@/i18n';
const { t } = useI18n();
const siteStore = useSiteStore();
const alertStore = useAlertStore();
const authStore = useAuthStore();
const accountStore = useAccountStore();
const { user } = storeToRefs(authStore);
const { breadcrums, page_heading } = storeToRefs(siteStore);
const { loading, error, data } = storeToRefs(accountStore);
const timezones = ref<string[]>([]);
const currencies = ref<string[]>([]);
const locales = ref<Record<string, LocaleInfo>>({});
const baseUrl = siteStore.getBaseUrl();
const countries = ref({});

type LocaleInfo = {
    name: string;
    local_name: string;
};

watchEffect(() => {
    siteStore.setPageHeading(t('account.contactInfo.title'));
    siteStore.setTitle(t('account.contactInfo.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('account.contactInfo.title')],
    ]);
});

watch(
    () => data.value.locale,
    async (locale) => {
        const resolvedLocale = setAppLocale(resolveAppLocale(locale));
        await Promise.all([loadLocaleMessages(resolvedLocale, 'common'), loadLocaleMessages(resolvedLocale, 'account'), loadLocaleMessages(defaultLocale, 'common'), loadLocaleMessages(defaultLocale, 'account')]);
    },
    { immediate: true }
);

async function onSubmit() {
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
    } catch (error: any) {
        console.log(error);
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

async function loadCurrencies() {
    try {
        await fetchWrapper.get(`${baseUrl}/account/currencies`).then((response) => {
            currencies.value = response;
        });
    } catch (error: any) {
        console.log('error loading currencies:', error);
    }
}

async function loadLocales() {
    try {
        await fetchWrapper.get(`${baseUrl}/account/locales`).then((response: Record<string, LocaleInfo>) => {
            locales.value = response;
        });
    } catch (error: any) {
        console.log('error loading locales:', error);
    }
}

accountStore.load();
loadCountries();
loadTimezones();
loadCurrencies();
loadLocales();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="callout callout-danger text-red text-sm">
                <i class="fas fa-bullhorn"></i>&nbsp;<strong>{{ t('account.contactInfo.headsUp') }}&nbsp;</strong>{{ t('account.contactInfo.headsUpMessage') }}
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title float-left py-2"><i class="far fa-id-card-o"></i>&nbsp;{{ t('account.contactInfo.cardTitle') }}</h3>
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
                                <img :src="user.gravatar" class="avatar rounded-circle img-thumbnail" alt="avatar" style="border-radius: 10% !important; max-width: 250px; display: inline" />
                            </div>
                            <h4 class="mb-2 text-center">{{ data.name }}&nbsp;({{ data.account_id }})</h4>
                            <h4 class="mb-2 text-center">{{ data.account_lid }}</h4>
                        </div>
                        <div class="col">
                            <form method="POST" @submit.prevent="onSubmit">
                                <h4 class="mb-4">{{ t('account.contactInfo.personalInformation') }}</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="name">{{ t('account.contactInfo.name') }}</label>
                                    <div class="col-md-6">
                                        <input id="name" v-model="data.name" type="text" class="form-control form-control-sm" name="name" :placeholder="t('account.contactInfo.namePlaceholder')" required autofocus />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="company">{{ t('account.contactInfo.company') }}</label>
                                    <div class="col-md-6">
                                        <input id="company" v-model="data.company" type="text" class="form-control form-control-sm" name="company" :placeholder="t('account.contactInfo.company')" required />
                                    </div>
                                </div>
                                <div v-if="data.country === 'IN'" class="form-group row" style="display: flex">
                                    <label class="col-md-3 col-form-label" for="gstin">{{ t('account.contactInfo.gstinTaxId') }}</label>
                                    <div class="col-md-6">
                                        <input id="gstin" v-model="data.gstin" type="text" class="form-control form-control-sm" name="gstin" :placeholder="t('account.contactInfo.gstinPlaceholder')" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address">{{ t('account.contactInfo.addressLine1') }}</label>
                                    <div class="col-md-6">
                                        <input id="address" v-model="data.address" type="text" class="form-control form-control-sm" name="address" :placeholder="t('account.contactInfo.addressLine1')" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="address2">{{ t('account.contactInfo.addressLine2') }}</label>
                                    <div class="col-md-6">
                                        <input id="address2" v-model="data.address2" type="text" class="form-control form-control-sm" name="address2" :placeholder="t('account.contactInfo.addressLine2')" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="city">{{ t('account.contactInfo.cityState') }}</label>
                                    <div class="col-md-3">
                                        <input id="city" v-model="data.city" type="text" class="form-control form-control-sm" name="city" :placeholder="t('account.contactInfo.city')" required />
                                    </div>
                                    <div class="col-md-3">
                                        <input id="state" v-model="data.state" type="text" class="form-control form-control-sm" name="state" :placeholder="t('account.contactInfo.state')" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="country">{{ t('account.contactInfo.country') }}</label>
                                    <div class="col-md-6">
                                        <select id="country" v-model="data.country" name="country" class="form-control select2 form-control-sm">
                                            <option v-for="(country_name, country_code) in countries" :key="country_code" :value="country_code" :selected="data.country === country_code">
                                                {{ country_name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="zip">{{ t('account.contactInfo.zipcode') }}</label>
                                    <div class="col-md-6">
                                        <input id="zip" v-model="data.zip" type="text" class="form-control form-control-sm" name="zip" :placeholder="t('account.contactInfo.zipcode')" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="phone">{{ t('account.contactInfo.phoneNo') }}</label>
                                    <div class="col-md-6">
                                        <input id="phone" v-model="data.phone" type="text" class="form-control form-control-sm" name="phone" :placeholder="t('account.contactInfo.phoneNumber')" required />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="locale">{{ t('account.contactInfo.language') }}</label>
                                    <div class="col-md-6">
                                        <select id="locale" v-model="data.locale" name="locale" class="form-control select2 form-control-sm">
                                            <option value="auto">{{ t('account.contactInfo.auto') }}</option>
                                            <option v-for="(localeData, code, index) in locales" :key="index" :value="code">{{ code }} - {{ localeData.name }} ({{ localeData.local_name }})</option>
                                        </select>
                                    </div>
                                    <span class="form-text"></span>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="currency">{{ t('account.contactInfo.currency') }}</label>
                                    <div class="col-md-6">
                                        <select id="currency" v-model="data.currency" name="currency" class="form-control select2 form-control-sm">
                                            <option v-for="(currency, index) in currencies" :key="index" :value="currency">{{ currency }}</option>
                                        </select>
                                    </div>
                                    <span class="form-text"></span>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="timezone">{{ t('account.contactInfo.timeZone') }}</label>
                                    <div class="col-md-6">
                                        <select id="timezone" v-model="data.timezone" name="timezone" class="form-control select2 form-control-sm">
                                            <option v-for="(zone, index) in timezones" :key="index" :value="zone">{{ zone }}</option>
                                        </select>
                                    </div>
                                </div>
                                <hr />
                                <h4 class="mb-4">{{ t('account.contactInfo.otherSettings') }}</h4>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_reset"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_reset" v-model="data.disable_reset" type="checkbox" name="disable_reset" value="1" />
                                            <label for="disable_reset">{{ t('account.contactInfo.disablePasswordResets') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_email_notifications"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_email_notifications" v-model="data.disable_email_notifications" type="checkbox" name="disable_email_notifications" value="1" />
                                            <label for="disable_email_notifications">{{ t('account.contactInfo.disableInvoiceReminders') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_server_notifications"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_server_notifications" v-model="data.disable_server_notifications" type="checkbox" value="1" />
                                            <label for="disable_server_notifications">{{ t('account.contactInfo.disableServerInvoiceReminders') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="disable_reinstall"></label>
                                    <div class="col-md-8">
                                        <div class="icheck-success d-inline">
                                            <input id="disable_reinstall" v-model="data.disable_reinstall" type="checkbox" value="1" />
                                            <label for="disable_reinstall">{{ t('account.contactInfo.disableReinstall') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_invoices">{{ t('account.contactInfo.alternateEmailInvoices') }}</label>
                                    <div class="col-md-6">
                                        <input id="email_invoices" v-model="data.email_invoices" type="email" class="form-control form-control-sm" name="email_invoices" :placeholder="t('account.contactInfo.alternateEmailInvoicesPlaceholder')" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="email_abuse">{{ t('account.contactInfo.alternateEmailAbuse') }}</label>
                                    <div class="col-md-6">
                                        <input id="email_abuse" v-model="data.email_abuse" type="email" class="form-control form-control-sm" name="email_abuse" :placeholder="t('account.contactInfo.alternateEmailAbuse')" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="save_settings">&nbsp;</label>
                                    <div class="controls col-md-6">
                                        <input id="save_settings" type="submit" name="Submit" :value="t('account.contactInfo.updateInfo')" class="btn btn-custom btn-sm" />
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
