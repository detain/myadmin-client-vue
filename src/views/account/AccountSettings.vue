<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useAccountStore, useAuthStore, useLayoutStore } from "@/stores";
import { AccountFeatures, ApiAccess, IpLimits, LinkedAccounts, SshKeys, TwoFactorAuth } from "@/components/account";
const layoutStore = useLayoutStore();
const accountStore = useAccountStore();
layoutStore.setPageHeading('Account Settings');
layoutStore.setTitle('Account Settings');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Account Settings'});
const baseUrl = import.meta.env.VITE_API_URL;

const { loading, error, custid, ima, csrf_token, link, data, ip, oauthproviders, oauthconfig, oauthadapters, limits } = storeToRefs(accountStore);

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
