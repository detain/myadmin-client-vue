<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Affiliate - ViewBanner');
siteStore.setTitle('Affiliate - ViewBanner');
siteStore.setBreadcrums({ '/home': 'Home', '/affiliate': 'Affiliate', '': 'ViewBanner' });

const url            = ref('{$url}');
const vpsUrl         = ref('{$vps_url}');
const webhostingUrl  = ref('{$webhosting_url}');
const imgDetail      = ref({ b: '', h: 0, w: 0 });
const sid            = ref('');
const landing        = ref('vps');
const customUrl      = ref('');
const custUrlVisible = ref(false);
const htmlCode       = ref('');
const landingUrl     = ref('');

function updateCode() {
    custUrlVisible.value = false;
    let urlValue = url.value;
    if (landing.value === 'vps') {
        urlValue = vpsUrl.value;
        if (sid.value) {
            urlValue = `${vpsUrl.value}&sid=${sid.value}`;
        }
    } else if (landing.value === 'webhosting') {
        urlValue = webhostingUrl.value;
        if (sid.value) {
            urlValue = `${webhostingUrl.value}&sid=${sid.value}`;
        }
    } else if (landing.value === 'custom') {
        const custUrlValue = customUrl.value;
        if (sid.value) {
            urlValue = `${urlValue}?sid=${sid.value}&url=${custUrlValue}`;
        } else {
            urlValue = `${urlValue}?url=${custUrlValue}`;
        }
        custUrlVisible.value = true;
    } else {
        if (sid.value) {
            urlValue = `${urlValue}?sid=${sid.value}`;
        }
    }
    htmlCode.value = `<a href="${urlValue}"><img src="https://www.interserver.net/logos/${imgDetail.value.b}" alt="InterServer Web Hosting and VPS"></a>`;
}

function copyCode() {
    const copyText = ((document.querySelector('#htmcode') as unknown) as HTMLInputElement).select();
    document.execCommand('copy');
    alert('HTML Code copied.');
}

onMounted(() => {});
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4>Banner Image</h4>
                </div>
                <table class="table-sm table">
                    <tr>
                        <td>Image</td>
                        <td>{{ imgDetail.b }}</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>Image Size</td>
                        <td>{{ imgDetail.w }}X{{ imgDetail.h }}</td>
                    </tr>
                    <tr>
                        <td>SID</td>
                        <td>
                            <textarea class="form-control" style="margin-top: 15px" cols="75" rows="2" v-model="sid" placeholder="eg. Home Page, Mailing list"></textarea>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>Landing Page URL</td>
                        <td>
                            <select class="form-control" id="landing-url" v-model="landingUrl">
                                <option value="">Select</option>
                                <option value="home">Home Page</option>
                                <option value="vps">VPS Page</option>
                                <option value="webhosting">Webhosting Page</option>
                                <option value="custom">Custom Url</option>
                            </select>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr v-if="landingUrl === 'custom'" id="cust_url">
                        <td>Custom URL</td>
                        <td><textarea id="custom_url" name="custom_url" class="form-control" cols="75" rows="4" v-model="customUrl" placeholder="https://www.interserver.net/">https://www.interserver.net/blog</textarea></td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td>HTML Code</td>
                        <td>
                            <textarea id="htmcode" class="form-control" readonly editable="false" cols="75" rows="4" v-model="htmlCode"></textarea>
                        </td>
                        <td><button id="copyText" class="btn btn-primary" @click="copyCode">Copy Code</button></td>
                    </tr>
                </table>
                <table class="table-sm table">
                    <tr>
                        <td>Image Preview</td>
                        <td><img :src="'https://www.interserver.net/logos/' + imgDetail.b" alt="InterServer Web Hosting and VPS" style="padding: 10px" /></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
