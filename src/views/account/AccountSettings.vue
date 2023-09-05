<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAccountStore, useSiteStore } from '@/stores';
import { AccountFeatures, ApiAccess, IpLimits, LinkedAccounts, SshKeys, TwoFactorAuth } from '@/components/account';
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Account Settings'],
]);
const baseUrl = siteStore.getBaseUrl();

const { loading, error, custid, ima, data, ip, oauthproviders, oauthconfig, oauthadapters, limits } = storeToRefs(accountStore);

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
            <LinkedAccounts :data="data" :oauthproviders="oauthproviders" :oauthconfig="oauthconfig" :oauthadapters="oauthadapters"></LinkedAccounts>
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
