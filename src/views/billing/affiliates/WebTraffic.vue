<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

import { fetchWrapper } from '@/helpers/fetchWrapper';

const { t } = useI18n();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.webTrafficPage.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.webTrafficPage.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.webTrafficPage.title')],
    ]);
});
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
    console.log('error', error);
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-globe"></i>&nbsp;{{ t('affiliate.webTrafficPage.webTraffic') }}</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('common.buttons.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="traffic.length == 0"> {{ t('affiliate.webTrafficPage.noTraffic') }} </template>
                    <template v-else>
                        <table class="table table-sm table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{{ t('affiliate.webTrafficPage.date') }}</th>
                                    <th>{{ t('affiliate.webTrafficPage.ip') }}</th>
                                    <th>{{ t('affiliate.webTrafficPage.url') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(row, index) in traffic" :key="index">
                                    <tr>
                                        <td>{{ row.traffic_timestamp }}</td>
                                        <td>{{ row.traffic_ip }}</td>
                                        <td>
                                            <a v-if="row.traffic_url != ''" class="link" :href="row.traffic_url" target="_blank" :title="row.traffic_url + ' (' + t('affiliate.webTrafficPage.loadInNewTab') + ')'">{{ row.traffic_url }}</a>
                                        </td>
                                    </tr>
                                    <template v-if="row.traffic_referer != ''">
                                        <tr>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>
                                                <b>{{ t('affiliate.webTrafficPage.referrer') }}</b> <a class="link" :href="row.traffic_referer" target="_blank" style="font-size: 10pt" :title="t('affiliate.webTrafficPage.viewInNewTab')">{{ row.traffic_referer }}</a>
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
