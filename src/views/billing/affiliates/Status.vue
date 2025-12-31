<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '../../../stores/site.store';

const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - Status');
siteStore.setTitle('Affiliate - Status');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'Status'],
]);

onMounted(() => {});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card card-outline card-secondary">
                <div class="card-body text-lg"><strong>Default -</strong> Client is registered under an affiliate but has not yet completed the requirements.</div>
            </div>
            <div class="card card-outline card-info">
                <div class="card-body text-lg"><strong>Pending -</strong> Client has met time and payment requirements, and is awaiting admin verification.</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>Failed -</strong> Client did not meet requirements or affiliate violated the terms in getting the client.</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>Locked -</strong> Client account is locked and no longer viable.</div>
            </div>
            <div class="card card-outline card-danger">
                <div class="card-body text-lg"><strong>Rejected -</strong> Account has permanently failed to meet the requirements.</div>
            </div>
            <div class="card card-outline card-success">
                <div class="card-body text-lg"><strong>Paid -</strong> Affiliate has already been paid for this clients signup.</div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
