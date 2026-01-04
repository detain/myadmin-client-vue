<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '../../../stores/site.store';

import { fetchWrapper } from '../../../helpers/fetchWrapper';

const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - Latest Web Traffic');
siteStore.setTitle('Affiliate - Latest Web Traffic');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['/affiliate/web_traffic', 'Latest Web Traffic'],
]);
const baseUrl = siteStore.getBaseUrl();

export interface AffiliateTrafficRow {
    traffic_id: number;
    traffic_ip: string;
    traffic_url: string;
    traffic_affiliate: number;
    traffic_referer: string;
    traffic_timestamp: string;
}
const traffic = ref<AffiliateTrafficRow[]>([]);
onMounted(() => {});

try {
    fetchWrapper.get(`${baseUrl}/affiliate/web_traffic`).then((response) => {
        traffic.value = response;
    });
} catch (error: any) {
    console.log('error');
    console.log(error);
}
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
                    <template v-if="traffic.length == 0"> No Recent Affiliate Traffic Matches Search </template>
                    <template v-else>
                        <table class="table table-sm table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>IP</th>
                                    <th>URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, index) in traffic" :key="index">
                                    <tr>
                                        <td>{{ row.traffic_timestamp }}</td>
                                        <td>{{ row.traffic_ip }}</td>
                                        <td>
                                            <a v-if="row.traffic_url != ''" class="link" :href="row.traffic_url" target="_blank" :title="row.traffic_url+'(Load Page in New Tab (be careful about cookies being set)'">{{ row.traffic_url }}</a>
                                        </td>
                                    </tr>
                                    <template v-if="row.traffic_referer != ''">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <b>referrer:</b> <a class="link" :href="row.traffic_referer" target="_blank" style="font-size: 10pt" title="View Page in New Tab (be careful about cookies being set">{{ row.traffic_referer }}</a>
                                            </td>
                                        </tr>
                                    </template>
                                </template>
                            </tbody>
                        </table>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
