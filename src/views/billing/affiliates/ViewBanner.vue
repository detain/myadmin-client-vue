<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useSiteStore } from '../../../stores/site.store';
import { useAccountStore } from '../../../stores/account.store';
const route = useRoute();
const accountStore = useAccountStore();
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - ViewBanner');
siteStore.setTitle('Affiliate - ViewBanner');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate System'],
    ['', 'Banners & Links'],
]);
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
                    <h4 class="float-left">Banner Image</h4>
                    <div class="card-tools float-right">
                        <router-link to="/affiliate/banners" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                    </div>
                </div>
                <table class="table table-sm">
                    <tr>
                        <td>Image</td>
                        <td>{{ imageFile }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Image Size</td>
                        <td>{{ width }} x {{ height }}</td>
                    </tr>
                    <tr>
                        <td>SID</td>
                        <td><textarea v-model="sid" class="form-control" cols="75" rows="2" placeholder="eg. Home Page, Mailing list" /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Landing Page URL</td>
                        <td>
                            <select v-model="landing" class="form-control">
                                <option value="">Select</option>
                                <option value="home">Home Page</option>
                                <option value="vps">VPS Page</option>
                                <option value="webhosting">Webhosting Page</option>
                                <option value="custom">Custom Url</option>
                            </select>
                        </td>
                        <td></td>
                    </tr>
                    <tr v-show="landing === 'custom'">
                        <td>Custom URL</td>
                        <td><textarea v-model="customUrl" class="form-control" cols="75" rows="4" placeholder="https://www.interserver.net/" /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>HTML Code</td>
                        <td><textarea class="form-control" cols="75" rows="4" readonly :value="htmlCode" /></td>
                        <td><button type="button" class="btn btn-primary" @click="copyHtml">Copy Code</button></td>
                    </tr>
                </table>
                <table class="table table-sm">
                    <tr>
                        <td>Image Preview</td>
                        <td><img :src="imageSrc" alt="InterServer Web Hosting and VPS" style="padding: 10px" /></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
