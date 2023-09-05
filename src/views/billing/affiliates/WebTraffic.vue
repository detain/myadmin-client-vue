<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - WebTraffic');
siteStore.setTitle('Affiliate - WebTraffic');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'WebTraffic'],
]);
const table = ref('');
onMounted(() => {});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-globe">&nbsp;</i>Web Traffic</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    {{ table }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
