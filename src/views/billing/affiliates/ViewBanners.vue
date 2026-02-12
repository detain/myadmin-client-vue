<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const { data } = storeToRefs(accountStore);
const baseUrl = siteStore.getBaseUrl();
siteStore.setPageHeading('Affiliate - Banners');
siteStore.setTitle('Affiliate - Banners');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'Banners'],
]);
const banners = ref<Banner[]>([]);
const usefulLinks = ref<UsefulLink[]>([
    { page: 'Default Home Page', link: `https://www.interserver.net/r/${data.value.account_id}` },
    { page: 'VPS Page', link: `https://www.interserver.net/vps?id=${data.value.account_id}` },
    { page: 'Web Hosting Page', link: `https://www.interserver.net/webhosting?id=${data.value.account_id}` },
    { page: 'Custom URL', link: `https://www.interserver.net/r/${data.value.account_id}?url=https://www.interserver.net/blog/` },
    { page: 'VPS Page With Tracking Keyword', link: `https://www.interserver.net/vps?id=${data.value.account_id}&sid=Mailing-List` },
]);

interface Banner {
    image: string;
    width: number;
    height: number;
    folder?: string;
}

interface UsefulLink {
    page: string;
    link: string;
}

function copyLink(text: string) {
    navigator.clipboard.writeText(text).then(() => alert('Link is copied.'));
}

onMounted(() => {
    //$('#freetile').freetile({});
});

function loadBanners() {
    try {
        fetchWrapper.get(`${baseUrl}/affiliate/banners`).then((response) => {
            console.log('affiliate banners success');
            console.log(response);
            banners.value = response;
        });
    } catch (error: any) {
        console.log('affiliate banners loading failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

loadBanners();
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <!-- Info Card -->
            <div class="card shadow-none w-100 bg-white p-2 mb-4" style="border-left: 4px solid skyblue; display: block ruby">
                <p class="m-0 text-md">
                    <i class="fas fa-info-circle text-info" aria-hidden="true"></i>
                    &nbsp;
                    <b class="text-info">Note:</b>
                    &nbsp;For details about banner like HTML code, image size, etc. Click on any banner image that you want to use on your website.
                </p>
            </div>

            <div class="card">
                <!-- Useful Affiliate Links Header -->
                <div class="card-header">
                    <div class="p-1 d-flex justify-content-between align-items-center">
                        <h3 class="card-title py-2"><i class="fa fa-link"></i>&nbsp;Useful Affiliate Links</h3>
                        <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                    </div>
                </div>

                <!-- Useful Affiliate Links Body -->
                <div class="card-body">
                    <div v-for="link in usefulLinks" :key="link.page" class="row justify-content-center">
                        <div class="col-md-2"></div>
                        <div class="col-md-2 px-0 text-bold">{{ link.page }}</div>
                        <div class="col-md-4">
                            <input class="inp b-radius form-control form-control-sm" type="text" :value="link.link" readonly />
                        </div>

                        <div class="col-md-2">
                            <button class="btn btn-custom btn-sm mb-3" @click="copyLink(link.link)">Copy Link To Clipboard</button>
                        </div>

                        <div class="col-md-2"></div>
                    </div>
                </div>

                <hr />

                <!-- Banners Header -->
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-picture-o"></i>&nbsp;Banners</h3>
                    </div>
                </div>

                <!-- Banners Body -->
                <div class="card-body">
                    <div class="banner-grid">
                        <router-link v-for="banner in banners" :key="banner.image" :to="`/affiliate/banners/${banner.image}?w=${banner.width}&h=${banner.height}`">
                            <img :src="`https://www.interserver.net/logos/${banner.image}`" alt="InterServer Web Hosting and VPS" />
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.inp {
    width: 100%;
}

/* Modern replacement for freetile */
.banner-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 10px;
}

.banner-grid img {
    padding: 10px;
    max-width: 100%;
    height: auto;
    display: block;
}
</style>
