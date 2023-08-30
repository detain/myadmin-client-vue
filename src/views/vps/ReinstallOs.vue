<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
const props                = defineProps(['id', 'module', 'settings', 'serviceInfo', 'serviceMaster']);
const successMsg           = ref('');
const cancelQueue          = ref('');
const fields               = ref({});
const siteStore            = useSiteStore();
const baseUrl              = siteStore.getBaseUrl();
const id                   = computed(() => { return props.id; });
const module               = computed(() => { return props.module; });
const settings             = computed(() => { return props.settings; });
const serviceInfo          = computed(() => { return props.serviceInfo; });
const serviceMaster        = computed(() => { return props.serviceMaster; });
const vpsTemplates         = ref<VpsTemplates>({});
const osDistro             = ref('');
const osVersion            = ref('');
const templateSelect       = ref({});
const currentOS            = ref('');
const checkVpsPassword     = ref(true);
const checkAccountPassword = ref(true);

const goBackLink = computed(() => {
    if (module.value === 'vps') {
        return `view_${module.value}`;
    } else {
        return 'view_qs';
    }
});

const formAction = computed(() => {
    return `${module.value === 'vps' ? 'view_vps' : 'view_qs'}?id=${id.value}&link=reinstall_os`;
});

const osDistroSelect = computed(() => {
  const distros = {};
  for (let idx in vpsTemplates.value) {
      let template = vpsTemplates.value[idx];
      distros[template.template_os] = template.template_name;
    }
    return distros;
});
const getOsDistro = computed(() => {
    if (Object.keys(vpsTemplates.value).length > 0 && osDistro.value == '') {
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

const osVersionSelect = computed(() => {
  const versions = {};
  for (let idx in vpsTemplates.value) {
      const template = vpsTemplates.value[idx];
      if (template.template_os == osDistro.value) {
            versions[template.template_file] = template.template_version;
        }
    }
    return versions;
});

onMounted(() => {
    console.log(serviceInfo.value);
});

function updateVPS() {
    // Perform logic for updating VPS based on selected values
}

function submitForm() {
    // Handle form submission
}

interface VpsTemplates {
    [key: string | number]: VpsTemplateRow;
}

interface VpsTemplateRow {
    template_id       : number;
    template_type     : number;
    template_os       : string;
    template_version  : string;
    template_bits     : number;
    template_file     : string;
    template_available: number;
    template_name     : string;
    template_dir      : string;
}

try {
    fetchWrapper.get(baseUrl + '/vps/' + id.value + '/reinstall_os').then((response) => {
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
} catch (error) {
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
                                <router-link :to="'/vps/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-if="successMsg" class="alert alert-success">
                            {{ successMsg }} <span v-if="cancelQueue">{{ cancelQueue }}</span>
                        </div>
                        <form @submit.prevent="submitForm" :action="formAction" class="reinstall_os">
                            <input type="hidden" name="link" value="reinstall_os" />

                            <div class="form-group">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="os">Current OS</label>
                                    <div class="col-sm-9 input-group">
                                        <input type="text" class="form-control form-control-sm" id="os" name="current_os" :value="currentOS" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vps_distro">Operating System Distribution</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="vps_distro" name="vps_distro" class="form-control form-control-sm select2" v-model="osDistro">
                                            <option v-for="(distro, ky, index) in osDistroSelect" :key="index" :value="ky">{{ distro }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="template">Version</label>
                                    <div class="col-sm-9 input-group">
                                        <select id="template" name="template" class="form-control form-control-sm select2" v-model="osVersion">
                                            <option v-for="(template, ky, index) in osVersionSelect" :key="index" :value="ky">{{ template }}</option>
                                        </select>
                                    </div>
                                </div>

                                <div v-if="checkVpsPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password">New Password</label>
                                        <div class="col-sm-9 input-group">
                                            <input type="password" class="pr-password form-control form-control-sm" id="password" name="password" required />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="password2">Confirm password</label>
                                        <div class="col-sm-9 input-group">
                                            <input type="password" class="pr-password form-control form-control-sm" id="password2" name="password2" required />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="checkAccountPassword">
                                    <div class="form-group row">
                                        <label class="col-md-3 col-form-label" for="passwd">Login Password</label>
                                        <div class="col-sm-9 input-group">
                                            <input type="password" class="form-control form-control-sm" id="passwd" name="passwd" required />
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
