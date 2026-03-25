<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';

const { t } = useI18n();
const route = useRoute();
const accountStore = useAccountStore();
const siteStore = useSiteStore();

watchEffect(() => {
    siteStore.setPageHeading(`${t('affiliate.title')} - ${t('affiliate.viewBanner.title')}`);
    siteStore.setTitle(`${t('affiliate.title')} - ${t('affiliate.viewBanner.title')}`);
    siteStore.setBreadcrums([
        ['/home', t('common.breadcrumb.home')],
        ['/affiliate', t('affiliate.breadcrumb')],
        ['', t('affiliate.viewBanners.title')],
    ]);
});
const { custid } = storeToRefs(accountStore);
const imageFile = route.params.id as string;
const width = route.query.w as string;
const height = route.query.h as string;
const sid = ref('');
const landing = ref('');
const customUrl = ref('https://www.interserver.net/blog');
const mainUrl = computed(() => `https://www.interserver.net/r/${custid.value}`);
const vpsUrl = computed(() => `https://www.interserver.net/vps?id=${custid.value}`);
const webhostingUrl = computed(() => `https://www.interserver.net/webhosting?id=${custid.value}`);
const imageSrc = computed(() => `https://www.interserver.net/logos/${imageFile}`);
const htmlCode = computed(() => `<a href="${finalUrl.value}"><img src="${imageSrc.value}" alt="InterServer Web Hosting and VPS"></a>`);
const finalUrl = computed(() => {
    let url = mainUrl.value;
    if (landing.value === 'vps') {
        url = vpsUrl.value;
        if (sid.value) url += `&sid=${encodeURIComponent(sid.value)}`;
    } else if (landing.value === 'webhosting') {
        url = webhostingUrl.value;
        if (sid.value) url += `&sid=${encodeURIComponent(sid.value)}`;
    } else if (landing.value === 'custom') {
        if (sid.value) {
            url += `?sid=${encodeURIComponent(sid.value)}&url=${encodeURIComponent(customUrl.value)}`;
        } else {
            url += `?url=${encodeURIComponent(customUrl.value)}`;
        }
    } else {
        if (sid.value) {
            url += `?sid=${encodeURIComponent(sid.value)}`;
        }
    }
    return url;
});

async function copyHtml() {
    await navigator.clipboard.writeText(htmlCode.value);
    alert('HTML Code copied.');
}

accountStore.loadOnce();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="float-start">{{ t('affiliate.viewBanner.bannerImage') }}</h4>
                    <div class="card-tools float-end">
                        <router-link to="/affiliate/banners" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('common.buttons.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                    </div>
                </div>
                <table class="table table-sm">
                    <tr>
                        <td>{{ t('affiliate.viewBanner.image') }}</td>
                        <td>{{ imageFile }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ t('affiliate.viewBanner.imageSize') }}</td>
                        <td>{{ width }} x {{ height }}</td>
                    </tr>
                    <tr>
                        <td>{{ t('affiliate.viewBanner.sid') }}</td>
                        <td><textarea v-model="sid" class="form-control" cols="75" rows="2" :placeholder="t('affiliate.viewBanner.sidPlaceholder')" /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ t('affiliate.viewBanner.landingPageUrl') }}</td>
                        <td>
                            <select v-model="landing" class="form-control">
                                <option value="">{{ t('affiliate.viewBanner.select') }}</option>
                                <option value="home">{{ t('affiliate.viewBanner.homePage') }}</option>
                                <option value="vps">{{ t('affiliate.viewBanner.vpsPage') }}</option>
                                <option value="webhosting">{{ t('affiliate.viewBanner.webhostingPage') }}</option>
                                <option value="custom">{{ t('affiliate.viewBanner.customUrl') }}</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-show="landing === 'custom'">
                        <td>{{ t('affiliate.viewBanner.customUrl') }}</td>
                        <td><textarea v-model="customUrl" class="form-control" cols="75" rows="4" placeholder="https://www.interserver.net/" /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{{ t('affiliate.viewBanner.htmlCode') }}</td>
                        <td><textarea class="form-control" cols="75" rows="4" readonly :value="htmlCode" /></td>
                        <td><button type="button" class="btn btn-primary" @click="copyHtml">{{ t('affiliate.viewBanner.copyCode') }}</button></td>
                    </tr>
                </table>
                <table class="table table-sm">
                    <tr>
                        <td>{{ t('affiliate.viewBanner.imagePreview') }}</td>
                        <td><img :src="imageSrc" alt="InterServer Web Hosting and VPS" style="padding: 10px" /></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
