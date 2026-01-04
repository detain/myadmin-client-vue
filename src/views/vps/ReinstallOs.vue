<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, watch, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps(['id', 'module', 'settings', 'serviceInfo', 'serviceMaster']);
const successMsg = ref('');
const cancelQueue = ref('');
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const settings = computed(() => {
    return props.settings;
});
const serviceInfo = computed(() => {
    return props.serviceInfo;
});
const serviceMaster = computed(() => {
    return props.serviceMaster;
});
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
            console.log('api success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        });
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.message}`,
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
    console.log('error:');
    console.log(error);
}
</script>

<template>
    <div>
        <div class="row mt-2">
            <div class="col-md-12">
                <div class="card w-100 mb-2 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                    <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red"> Important Note #1:</b>&nbsp;Re-installing the operating system will delete all data.</p>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                    </div>
                    <p></p>
                </div>
                <div class="card w-100 mb-4 bg-white p-2 shadow-none" style="border-left: 4px solid red; display: block ruby">
                    <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red"> Important Note #2:</b>&nbsp;Before Re-installing the operating system kindly take a backup.</p>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
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
                            <h3 class="card-title py-2"><i class="fa fa-linux">&nbsp;</i>Reinstall OS</h3>
                            <div class="card-tools text-right">
                                <router-link :to="'/'+moduleLink(module)+'/'+props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
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
                                    <label class="col-md-3 col-form-label" for="os">Current OS</label>
                                    <div class="col-sm-9 input-group">
                                        <input id="os" type="text" class="form-control form-control-sm" name="current_os" :value="serviceInfo.vps_os" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vps_distro">Operating System Distribution</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="vps_distro" v-model="osDistro" name="vps_distro" class="form-control form-control-sm select2">
                                            <option v-for="(distro, ky, index) in osDistroSelect" :key="index" :value="ky">{{ distro }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="template">Version</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="template" v-model="osVersion" name="template" class="form-control form-control-sm select2">
                                            <option v-for="(template, ky, index) in osVersionSelect" :key="index" :value="ky">{{ template }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div v-if="checkVpsPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password">New Password</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="password" type="password" class="pr-password form-control form-control-sm" name="password" required />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password2">Confirm password</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="password2" type="password" class="pr-password form-control form-control-sm" name="password2" required />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="checkAccountPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="passwd">Login Password</label>
                                        <div class="col-sm-9 input-group">
                                            <input id="passwd" type="password" class="form-control form-control-sm" name="passwd" required />
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="input-group">
                                        <div class="icheck-success col-md-12 text-bold mt-3 text-black">
                                            <input id="confirmation" type="checkbox" name="confirm" value="yes" required />
                                            <label for="confirmation">I want to Re-install the OS!</label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="form-group row justify-content-center">
                                    <div class="controls col-md-12" style="text-align: center">
                                        <input type="submit" name="Submit" value="Confirm Reinstall OS" class="btn btn-sm btn-order px-3 py-2" />
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
