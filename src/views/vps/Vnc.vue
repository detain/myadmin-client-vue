<script setup lang="ts">
import { fetchWrapper, moduleLink } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const module = computed(() => {
    return props.module;
});
const vpsScreenshot = ref('');
const setupVncLink = ref('');
const novncLink = ref('');
</script>

<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">Microsoft Remote Desktop Connection</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" data-toggle="tooltip" title="Go Back" class="btn btn-custom btn-sm"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="p-3">
                    <table class="table-sm table-bordered table">
                        <tr>
                            <td style="text-align: center; width: 20%">
                                <img style="height: 150px" alt="Remote Desktop Icon" src="/images/vps/remote_desktop.jpg" />
                            </td>
                            <td class="p-3">
                                <p>Available <b>only</b> on the <b>Windows Platform</b>. Remote desktop is a quick and convenient way to connect to a virtual machine's desktop.</p>
                                <ul>
                                    <li>The Administrator password must first be set on the VPS before you can use remote desktop.</li>
                                    <li>Connect with VNC or HTML5 VNC to set your initial password.</li>
                                </ul>
                                <strong>NOTE:</strong> For a remote desktop tutorial click <a href="//interserver.net/resolve/Knowledgebase/Article/View/192/28/how-to-remote-desktop-to-vps" target="_blank"><span class="link text-bold">here</span>.</a><br />
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-desktop">&nbsp;</i>Desktop VNC Connection</h3>
                    </div>
                </div>
                <div class="card-body p-3">
                    <table class="table-sm table-bordered mb-0 table">
                        <tr>
                            <td>
                                <img style="height: 150px" alt="VNC Icon" src="//upload.wikimedia.org/wikipedia/en/thumb/5/51/Virtual_Network_Computing_%28logo%29.svg/1168px-Virtual_Network_Computing_%28logo%29.svg.png" />
                            </td>
                            <td>
                                <p class="mx-3 px-4 pt-3">VNC allows you to connect to the virtual machine's desktop. VNC can be run in the browser or as a stand-alone client. Your computer's IP address must be granted access before the connection can be established.</p>
                                <ul>
                                    <li><b>Step 1</b>: Click link to grant your IP Access to VNC. <a v-bind:href="setupVncLink" target="_blank" class="link text-bold" style="transition-duration: 0.3s">Grant Your IP access to VNC </a>Please wait 2 minutes for the action to complete.</li>
                                    <li><b>Step 2</b>: You can also download one of the many VNC clients available on the internet. We recommend TightVNC. Connect using your VPS IP address. Password is not required after your remote IP address has been granted in step 1.&nbsp;<span class="Apple-converted-space"></span></li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-firefox text-orange">&nbsp;</i>Browser VNC Connection</h3>
                    </div>
                </div>
                <div class="d-flex p-3">
                    <table style="width: 15%" class="table-sm table-bordered mb-0 table">
                        <tr>
                            <td style="width: 100px; vertical-align: middle">
                                <img v-if="vpsScreenshot" style="height: 100px" :src="vpsScreenshot" alt="VPS Screenshot" />
                                <img alt="" v-else style="height: 100px" src="//i.ytimg.com/vi/B-3yfcIiLZc/maxresdefault.jpg" />
                            </td>
                        </tr>
                    </table>
                    <div style="width: 85%; border: 1px solid #dee2e6">
                        <div class="p-2" style="border: 1px solid #dee2e6">
                            To connect using HTML5 VNC Client:
                            <a class="link text-bold ml-1" style="transition-duration: 0.3s" target="_blank" :href="novncLink">Click Here</a>
                        </div>
                        <div class="p-2" style="border: 1px solid #dee2e6">To connect using old layout: <a class="link text-bold ml-1" style="transition-duration: 0.3s" target="_blank" :href="`${novncLink}&mode=basic`">Click Here</a></div>
                        <div class="p-2" style="border: 1px solid #dee2e6">HTML5 VNC client that runs well in any modern browser including mobile browsers (iOS and Android).</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
