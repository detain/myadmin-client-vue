<script setup lang="ts">
import { ref, reactive, computed, onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAccountStore } from '@/stores/account.store';
import { useSiteStore } from '@/stores/site.store';
import { loadLocaleMessages } from '@/i18n';

import AccountFeatures from '@/components/account/AccountFeatures.vue';
import ApiAccess from '@/components/account/ApiAccess.vue';
import IpLimits from '@/components/account/IpLimits.vue';
import LinkedAccounts from '@/components/account/LinkedAccounts.vue';
import SshKeys from '@/components/account/SshKeys.vue';
import TwoFactorAuth from '@/components/account/TwoFactorAuth.vue';

await loadLocaleMessages('en', 'account');
const { t } = useI18n();

const siteStore = useSiteStore();
const accountStore = useAccountStore();
watchEffect(() => {
    siteStore.setPageHeading(t('account.settings.title'));
    siteStore.setTitle(t('account.settings.title'));
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['', t('account.settings.title')],
    ]);
});
const baseUrl = siteStore.getBaseUrl();

const { loading, error, custid, ima, data, ip, oAuthProviders, oAuthConfig, oAuthAdapters, limits } = storeToRefs(accountStore);

accountStore.load();
</script>

<template>
    <div class="row">
        <div class="col-md-6">
            <IpLimits :data="data" :limits="limits" :ip="ip"></IpLimits>
        </div>
        <div class="col-md-6">
            <ApiAccess :data="data"></ApiAccess>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <SshKeys :data="data"></SshKeys>
        </div>
        <div class="col-md-6">
            <LinkedAccounts :data="data" :o-auth-providers="oAuthProviders" :o-auth-config="oAuthConfig" :o-auth-adapters="oAuthAdapters"></LinkedAccounts>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <TwoFactorAuth :data="data"></TwoFactorAuth>
        </div>
        <div class="col-md-6">
            <AccountFeatures :data="data"></AccountFeatures>
        </div>
    </div>
</template>
