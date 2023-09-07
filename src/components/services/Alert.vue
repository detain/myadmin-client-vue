<script setup lang="ts">
import { ref } from 'vue';
import { CancelDomain, CancelLicense, CancelMail, CancelQs, CancelSsl, CancelStorage, CancelVps, CancelWebsite, Confirm } from '@/components/alerts';

const props = defineProps({
    display: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
    },
    status: {
        type: String,
    },
    hostname: {
        type: String,
    },
    addons: {
        type: Array,
        default: () => [],
    },
    username: {
        type: String,
    },
    ip: {
        type: String,
    },
    order_id: {
        type: String,
    },
    funct: {
        type: String,
    },
    html: {
        type: String,
    },
});
</script>

<template>
    <div>
        <template v-if="display === 'yes' && action === 'cancel_domain'">
            <CancelDomain :url="url" :domain="domain" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_vps'">
            <CancelVps :url="url" :hostname="hostname" :addons="addons" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_website'">
            <CancelWebsite :url="url" :hostname="hostname" :addons="addons" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_qs'">
            <CancelQs :url="url" :hostname="hostname" :addons="addons" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_storage'">
            <CancelStorage :url="url" :username="username" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_license'">
            <CancelLicense :url="url" :ip="ip" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_mail'">
            <CancelMail :url="url" :username="username" />
        </template>
        <template v-else-if="display === 'yes' && action === 'cancel_ssl'">
            <CancelSsl :url="url" :order_id="order_id" />
        </template>
        <template v-else-if="display === 'yes' && action === 'whois'">
            <!-- <Whois :url="url" :funct="funct" :domain="domain" /> -->
        </template>
        <template v-else-if="display === 'yes' && action === 'confirm'">
            <Confirm :url="url" :html="html" />
        </template>
    </div>
</template>

<style scoped></style>
