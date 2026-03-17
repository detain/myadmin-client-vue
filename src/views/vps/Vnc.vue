<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
}>();
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const id = computed(() => props.id);
const module = computed(() => props.module);
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
                        <h3 class="card-title py-2">{{ t('vps.vnc.remoteDesktop') }}</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" data-toggle="tooltip" :title="t('vps.common.goBack')" class="btn btn-custom btn-sm"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="p-3">
                    <table class="table-sm table-bordered table">
                        <tbody>
                            <tr>
                                <td style="text-align: center; width: 20%">
                                    <img style="height: 150px" alt="Remote Desktop Icon" src="../../assets/images/vps/remote_desktop.jpg" />
                                </td>
                                <td class="p-3">
                                    <p>{{ t('vps.vnc.remoteDesktopDescription') }}</p>
                                    <ul>
                                        <li>{{ t('vps.vnc.remoteDesktopStep1') }}</li>
                                        <li>{{ t('vps.vnc.remoteDesktopStep2') }}</li>
                                    </ul>
                                    <strong>NOTE:</strong> {{ t('vps.vnc.remoteDesktopNote') }} <a href="//interserver.net/resolve/Knowledgebase/Article/View/192/28/how-to-remote-desktop-to-vps" target="_blank"><span class="link text-bold">{{ t('vps.vnc.here') }}</span>.</a><br />
                                </td>
                            </tr>
                        </tbody>
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
                        <h3 class="card-title py-2"><i class="fas fa-desktop"></i>&nbsp;{{ t('vps.vnc.desktopVnc') }}</h3>
                    </div>
                </div>
                <div class="card-body p-3">
                    <table class="table-sm table-bordered mb-0 table">
                        <tbody>
                            <tr>
                                <td>
                                    <img style="height: 150px" alt="VNC Icon" src="//upload.wikimedia.org/wikipedia/en/thumb/5/51/Virtual_Network_Computing_%28logo%29.svg/1168px-Virtual_Network_Computing_%28logo%29.svg.png" />
                                </td>
                                <td>
                                    <p class="mx-3 px-4 pt-3">{{ t('vps.vnc.desktopVncDescription') }}</p>
                                    <ul>
                                        <li><b>Step 1</b>: {{ t('vps.vnc.grantIpAccess') }} <a :href="setupVncLink" target="_blank" class="link text-bold" style="transition-duration: 0.3s">{{ t('vps.vnc.grantIpAccess') }} </a>{{ t('vps.vnc.grantIpWait') }}</li>
                                        <li><b>Step 2</b>: {{ t('vps.vnc.vncClientNote') }}&nbsp;<span class="Apple-converted-space"></span></li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
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
                        <h3 class="card-title py-2"><i class="fab fa-firefox text-orange"></i>&nbsp;{{ t('vps.vnc.browserVnc') }}</h3>
                    </div>
                </div>
                <div class="d-flex p-3">
                    <table style="width: 15%" class="table-sm table-bordered mb-0 table">
                        <tbody>
                            <tr>
                                <td style="width: 100px; vertical-align: middle">
                                    <img v-if="vpsScreenshot" style="height: 100px" :src="vpsScreenshot" alt="VPS Screenshot" />
                                    <img v-else alt="" style="height: 100px" src="//i.ytimg.com/vi/B-3yfcIiLZc/maxresdefault.jpg" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="width: 85%; border: 1px solid #dee2e6">
                        <div class="p-2" style="border: 1px solid #dee2e6">
                            {{ t('vps.vnc.connectHtml5') }}
                            <a class="link text-bold ml-1" style="transition-duration: 0.3s" target="_blank" :href="novncLink">{{ t('vps.vnc.clickHere') }}</a>
                        </div>
                        <div class="p-2" style="border: 1px solid #dee2e6">{{ t('vps.vnc.connectOldLayout') }} <a class="link text-bold ml-1" style="transition-duration: 0.3s" target="_blank" :href="`${novncLink}&mode=basic`">{{ t('vps.vnc.clickHere') }}</a></div>
                        <div class="p-2" style="border: 1px solid #dee2e6">{{ t('vps.vnc.html5Note') }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
