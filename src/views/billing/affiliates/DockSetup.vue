<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';

import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';

import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const accountStore = useAccountStore();
siteStore.setPageHeading('Affiliate - Dock Setup');
siteStore.setTitle('Affiliate - Dock Setup');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'Dock Setup'],
]);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const { data } = storeToRefs(accountStore);
const referrerCoupon = ref(data.value.referrer_coupon || '');
const affiliateDockTitle = ref(data.value.affiliate_dock_title || '');
const affiliateDockDescription = ref(data.value.affiliate_dock_description || '');

function onSubmit() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/affiliate/dock_setup`, {
                coupon: referrerCoupon.value,
                title: affiliateDockTitle.value,
                description: affiliateDockDescription.value,
            })
            .then((response) => {
                Swal.close();
                console.log('affiliate dock success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('affiliate dock failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

onMounted(() => {});
accountStore.loadOnce();
</script>

<template>
    <!-- <link rel="stylesheet"
    href="//affiliateimages.interserver.net/node_modules/blueimp-gallery/css/blueimp-gallery.min.css">
<script src="//affiliateimages.interserver.net/js/vendor/jquery.ui.widget.js"></script>
<script src="//affiliateimages.interserver.net/lib/blueimp-tmpl/js/tmpl.min.js"></script>
<script src="//affiliateimages.interserver.net/lib/blueimp-load-image/js/load-image.all.min.js"></script>
<script src="//affiliateimages.interserver.net/lib/blueimp-canvas-to-blob/js/canvas-to-blob.min.js"></script>
<script src="//affiliateimages.interserver.net/node_modules/blueimp-gallery/js/jquery.blueimp-gallery.min.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.iframe-transport.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-process.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-image.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-audio.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-video.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-validate.js"></script>
<script src="//affiliateimages.interserver.net/js/jquery.fileupload-ui.js"></script> -->
    <!-- The main application script -->
    <!-- <script src="//affiliateimages.interserver.net/js/main.js"></script> -->
    <!-- The XDomainRequest Transport is included for cross-domain file deletion for IE 8 and IE 9 -->
    <!--[if (gte IE 8)&(lt IE 10)]>
        <script src="//affiliateimages.interserver.net/js/cors/jquery.xdr-transport.js"></script>
    <![endif]-->
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-ticket">&nbsp;</i>Affiliate Landing Page Setup (<a :href="`https://www.interserver.net/dock/vps-${user.account_id}.html`" class="link mt-0" target="_blank">View Landing Page</a>)</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form id="dockform" method="post" enctype="multipart/form-data" @submit.prevent="onSubmit">
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label text-right" for="referrer_coupon">Coupon Name<span class="text-danger"> *</span></label>
                            <div class="col-sm-9 input-group">
                                <input id="referrer_coupon" v-model="referrerCoupon" type="text" name="referrer_coupon" class="form-control form-control-sm" data-toggle="popover" data-content="When a new client uses this coupon it will tag them as being referred by you and will get listed as an affiliate sale." title="Note" required />
                            </div>
                        </div>
                        <!-- <div class="form-group row">
                        <label class="col-sm-3 col-form-label text-right" for="fileupload">Image
                            <span class="text-danger"> *</span>
                        </label>
                        <div class="col-sm-9 input-group">
                            <input type="file" name="fileupload" id="fileupload"
                                class="form-control form-control-sm input-file" required>
                        </div>
                    </div> -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label text-right" for="affiliate_dock_title">Title<span class="text-danger"> *</span></label>
                            <div class="col-sm-9 input-group">
                                <input id="affiliate_dock_title" v-model="affiliateDockTitle" type="text" name="affiliate_dock_title" class="form-control form-control-sm" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label text-right" for="affiliate_dock_description">Description<span class="text-danger"> *</span></label>
                            <div class="col-sm-9 input-group">
                                <textarea id="affiliate_dock_description" v-model="affiliateDockDescription" class="form-control form-control-sm" name="affiliate_dock_description" rows="4" required placeholder="Use this coupon when placing an order to get the first month of hosting for only 1 penny."></textarea>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <button id="submitdock" class="btn btn-order btn-sm px-3 py-2" type="submit">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- <script src="/js/affiliate_dock_setup.js?202211221046"></script> -->
</template>

<style scoped></style>
