<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import { VpsInfo } from '@/types/vps';
import { QsInfo } from '@/types/qs';
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: any;
    serviceMaster: any;
}>();
const successMsg = ref('');
const cancelQueue = ref('');
const siteStore = useSiteStore();
const { modules } = storeToRefs(siteStore);
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const module = computed(() => props.module);
const serviceInfo = computed(() => props.serviceInfo);
const serviceMaster = computed(() => props.serviceMaster);
const settings = computed(() => modules.value[module.value]);
const vpsTemplates = ref<VpsTemplate[]>([]);
const osDistro = ref('');
const osVersion = ref('');
const checkVpsPassword = ref(true);
const checkAccountPassword = ref(true);
const osDistroSelect = computed(() => {
    const distros: Distros = {};
    for (let idx in vpsTemplates.value) {
        const template = vpsTemplates.value[idx];
        distros[template.template_os] = template.template_name;
    }
    return distros;
});
watch(serviceInfo, () => {
    osDistro.value = getOsDistro.value;
    osVersion.value = getOsVersion.value;
});
const getOsDistro = computed(() => {
    if (typeof serviceInfo.value.vps_os != 'undefined' && vpsTemplates.value.length > 0 && osDistro.value == '') {
        if (typeof serviceInfo.value.vps_os != 'undefined') {
            for (let idx in vpsTemplates.value) {
                const template = vpsTemplates.value[idx];
                if (template.template_file == serviceInfo.value.vps_os) {
                    return template.template_os;
                }
            }
        }
        return vpsTemplates.value[0].template_os;
    } else {
        return osDistro.value;
    }
});
const getOsVersion = computed(() => {
    if (typeof serviceInfo.value.vps_os != 'undefined' && vpsTemplates.value.length > 0 && osVersion.value == '') {
        if (typeof serviceInfo.value.vps_os != 'undefined') {
            for (let idx in vpsTemplates.value) {
                const template = vpsTemplates.value[idx];
                if (template.template_file == serviceInfo.value.vps_os) {
                    return template.template_file;
                }
            }
        }
        return vpsTemplates.value[0].template_file;
    } else {
        return osVersion.value;
    }
});

const osVersionSelect = computed(() => {
    const versions: Distros = {};
    for (let idx in vpsTemplates.value) {
        const template = vpsTemplates.value[idx];
        if (template.template_os == osDistro.value) {
            versions[template.template_file] = template.template_version;
        }
    }
    return versions;
});

interface Distros {
    [key: string]: string;
}

interface VpsTemplatesResponse {
    templates: VpsTemplate[];
}

interface VpsTemplate {
    template_id: number;
    template_type: number;
    template_os: string;
    template_version: string;
    template_bits: number;
    template_file: string;
    template_available: number;
    template_name: string;
    template_dir: string;
}

function submitForm() {
    // Handle form submission
    try {
        let postData = {
            template: osVersion.value,
            password: checkVpsPassword.value,
            loginPassword: checkAccountPassword.value,
        };
        fetchWrapper.post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/reinstall_os`, postData).then((response: any) => {
            console.log('api success', response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        });
    } catch (error: any) {
        console.log('api failed', error);
        Swal.fire({
            icon: 'error',
            html: t('vps.common.gotError', { error: error.message }),
        });
    }
}

onMounted(() => {
    console.log(serviceInfo.value);
});

try {
    fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/reinstall_os`).then((response: VpsTemplatesResponse) => {
        console.log(response);
        vpsTemplates.value = response.templates;
        for (let idx in vpsTemplates.value) {
            const template = vpsTemplates.value[idx];
            if (template.template_file == serviceInfo.value.vps_os) {
                osDistro.value = template.template_os;
                osVersion.value = template.template_file;
            }
        }
    });
} catch (error: any) {
    console.log('error:', error);
}
</script>

<template>
    <div>
        <div class="row mt-2">
            <div class="col-md-12">
                <div class="card w-100 mb-2 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                    <p class="text-md m-0"><font-awesome-icon :icon="['fas', 'info-circle']" class="text-red" style="color: red" />&nbsp;<b class="text-red"> {{ t('vps.common.importantNoteLabel', { number: 1 }) }}</b>&nbsp;{{ t('vps.reinstallOs.importantNote1') }}</p>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><font-awesome-icon :icon="['fas', 'times']" /></button>
                    </div>
                    <p></p>
                </div>
                <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                    <p class="text-md m-0"><font-awesome-icon :icon="['fas', 'info-circle']" class="text-red" style="color: red" />&nbsp;<b class="text-red"> {{ t('vps.common.importantNoteLabel', { number: 2 }) }}</b>&nbsp;{{ t('vps.reinstallOs.importantNote2') }}</p>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><font-awesome-icon :icon="['fas', 'times']" /></button>
                    </div>
                    <p></p>
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-9">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><font-awesome-icon :icon="['fab', 'linux']" />&nbsp;{{ t('vps.reinstallOs.title') }}</h3>
                            <div class="card-tools text-right">
                                <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" :title="t('vps.common.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" />&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-if="successMsg" class="alert alert-success">
                            {{ successMsg }} <span v-if="cancelQueue">{{ cancelQueue }}</span>
                        </div>
                        <form class="reinstall_os" @submit.prevent="submitForm">
                            <input type="hidden" name="link" value="reinstall_os" />

                            <div class="form-group">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="os">{{ t('vps.reinstallOs.currentOs') }}</label>
                                    <div class="col-sm-9 input-group">
                                        <input id="os" type="text" class="form-control form-control-sm" name="current_os" :value="serviceInfo.vps_os" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vps_distro">{{ t('vps.reinstallOs.osDistribution') }}</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="vps_distro" v-model="osDistro" name="vps_distro" class="form-control form-control-sm select2">
                                            <option v-for="(distro, ky, index) in osDistroSelect" :key="index" :value="ky">{{ distro }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="template">{{ t('vps.reinstallOs.version') }}</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="template" v-model="osVersion" name="template" class="form-control form-control-sm select2">
                                            <option v-for="(template, ky, index) in osVersionSelect" :key="index" :value="ky">{{ template }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div v-if="checkVpsPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password">{{ t('vps.reinstallOs.newPassword') }}</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="password" type="password" class="pr-password form-control form-control-sm" name="password" required />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password2">{{ t('vps.reinstallOs.confirmPassword') }}</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="password2" type="password" class="pr-password form-control form-control-sm" name="password2" required />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="checkAccountPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="passwd">{{ t('vps.reinstallOs.loginPassword') }}</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="passwd" type="password" class="form-control form-control-sm" name="passwd" required />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="input-group">
                                        <div class="icheck-success col-md-12 text-bold mt-3 text-black">
                                            <input id="confirmation" type="checkbox" name="confirm" value="yes" required />
                                            <label for="confirmation">{{ t('vps.reinstallOs.confirmReinstall') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="form-group row justify-content-center">
                                    <div class="controls col-md-12" style="text-align: center">
                                        <input type="submit" name="Submit" :value="t('vps.reinstallOs.confirmReinstallButton')" class="btn btn-sm btn-order px-3 py-2" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
