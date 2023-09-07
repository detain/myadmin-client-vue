<script setup lang="ts">
import { ref } from 'vue';
import { CancelDomain, CancelLicense, CancelMail, CancelQs, CancelSsl, CancelStorage, CancelVps, CancelWebsite, Confirm } from '@/components/alerts';

const display = ref('yes');
const action = ref('eppcode');
const actions = ref([
    'cancel_domain',
    'cancel_vps',
    'cancel_website',
    'cancel_qs',
    'cancel_storage',
    'cancel_license',
    'cancel_mail',
    'cancel_ssl',
    'confirm',
]);
</script>

<template>
    <div v-if="display == 'yes'">
        <CancelDomain v-if="action == 'cancel_domain'" data="{ domain: 'example.com' }" />
        <CancelVps v-else-if="action == 'cancel_vps'" data="{ vpsId: 123 }" />
        <CancelWebsite v-else-if="action == 'cancel_website'" data="{ websiteId: 456 }" />
        <CancelQs v-else-if="action == 'cancel_qs'" data="{ qsId: 789 }" />
        <CancelStorage v-else-if="action == 'cancel_storage'" data="{ storageId: 987 }" />
        <CancelLicense v-else-if="action == 'cancel_license'" data="{ licenseId: 654 }" />
        <CancelMail v-else-if="action == 'cancel_mail'" data="{ username: 'example' }" />
        <CancelSsl v-else-if="action == 'cancel_ssl'" data="{ orderId: 321 }" />
        <Confirm v-else-if="action == 'confirm'" data="{ url: 'example.com', html: '<p>Confirmation message</p>' }" />
    </div>
</template>

<style scoped></style>
