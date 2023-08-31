<script setup lang="ts">
import { ref } from 'vue';

import BuyIp from '@components/alerts/BuyIp.vue';
import CancelDomain from '@components/alerts/CancelDomain.vue';
import CancelLicense from '@components/alerts/CancelLicense.vue';
import CancelMail from '@components/alerts/CancelMail.vue';
import CancelQs from '@components/alerts/CancelQs.vue';
import CancelSsl from '@components/alerts/CancelSsl.vue';
import CancelStorage from '@components/alerts/CancelStorage.vue';
import CancelVps from '@components/alerts/CancelVps.vue';
import CancelWebsite from '@components/alerts/CancelWebsite.vue';
import Confirm from '@components/alerts/Confirm.vue';
//import EppCode from '@components/alerts/EppCode.vue';
//import Lock from '@components/alerts/Lock.vue';
//import Whois from '@components/alerts/Whois.vue';

const display = ref('yes');
const action = ref('eppcode');
const actions = ref([
    //'eppcode',
    //'lock',
    'cancel_domain',
    'cancel_vps',
    'cancel_website',
    'cancel_qs',
    'cancel_storage',
    'cancel_license',
    'cancel_mail',
    'cancel_ssl',
    //'whois',
    'buy_ip',
    'confirm',
]);
</script>

<template>
    <div v-if="display == 'yes'">
        <EppCode v-if="action == 'eppcode'" data="{ domain: 'example.com' }" />
        <Lock v-else-if="action == 'lock'" data="{ domain: 'example.com' }" />
        <CancelDomain v-else-if="action == 'cancel_domain'" data="{ domain: 'example.com' }" />
        <CancelVps v-else-if="action == 'cancel_vps'" data="{ vpsId: 123 }" />
        <CancelWebsite v-else-if="action == 'cancel_website'" data="{ websiteId: 456 }" />
        <CancelQs v-else-if="action == 'cancel_qs'" data="{ qsId: 789 }" />
        <CancelStorage v-else-if="action == 'cancel_storage'" data="{ storageId: 987 }" />
        <CancelLicense v-else-if="action == 'cancel_license'" data="{ licenseId: 654 }" />
        <CancelMail v-else-if="action == 'cancel_mail'" data="{ username: 'example' }" />
        <CancelSsl v-else-if="action == 'cancel_ssl'" data="{ orderId: 321 }" />
        <Whois v-else-if="action == 'whois'" data="{ domain: 'example.com' }" />
        <BuyIp v-else-if="action == 'buy_ip'" data="{ domain: 'example.com' }" />
        <Confirm v-else-if="action == 'confirm'" data="{ url: 'example.com', html: '<p>Confirmation message</p>' }" />
    </div>
</template>

<style scoped></style>
