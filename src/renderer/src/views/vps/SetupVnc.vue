<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { useAccountStore } from '@/stores/account.store';
import { VpsInfo, VpsServiceMaster } from '@/types/vps';
import { QsInfo, QsServiceMaster } from '@/types/qs';

import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
type ServiceInfo = VpsInfo | QsInfo;
type ServiceMaster = VpsServiceMaster | QsServiceMaster;
const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: ServiceInfo;
    serviceMaster: ServiceMaster;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const accountStore = useAccountStore();
const { ip } = storeToRefs(accountStore);
const id = computed(() => props.id);
const module = computed(() => props.module);
const serviceInfo = computed(() => props.serviceInfo);
const serviceMaster = computed(() => props.serviceMaster);
const { modules } = storeToRefs(siteStore);
const settings = computed(() => modules.value[module.value]);
function useServiceInfoField<T = string>(suffix: string) {
    return computed<T>(() => {
        const prefix = settings.value.PREFIX; // 'vps' | 'qs'
        const key = `${prefix}_${suffix}` as keyof ServiceInfo;
        return (serviceInfo.value as ServiceInfo)[key] as T;
    });
}
function useServiceMasterField<T = string>(suffix: string) {
    return computed<T>(() => {
        const prefix = settings.value.PREFIX; // 'vps' | 'qs'
        const key = `${prefix}_${suffix}` as keyof ServiceMaster;
        return (serviceMaster.value as ServiceMaster)[key] as T;
    });
}
const hostname = useServiceInfoField<string>('hostname');
const serviceIp = useServiceInfoField<string>('ip');
const vncPort = useServiceInfoField<string>('vnc_port');
const masterIp = useServiceMasterField<string>('ip');
const myip = ref(ip.value);
function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/setup_vnc`, {
                ip: myip.value,
            })
            .then((response) => {
                Swal.close();
                console.log('vps setup vnc success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('vps setup vnc failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}
accountStore.loadOnce();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="py-2">
                        <h3 class="card-title"><i class="material-icons mb-1 pr-2" style="vertical-align: middle">alarm</i>Setup VNC</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pb-0">
                    <form @submit.prevent="submitForm">
                        <div class="form-group">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="vncname">VPS Name</label>
                                <div class="col-sm-9 input-group">
                                    <input id="vncname" type="text" class="form-control form-control-sm" :value="hostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="vncserver">VPS IP</label>
                                <div class="col-sm-9 input-group">
                                    <input id="vncserver" type="text" class="form-control form-control-sm" :value="serviceIp" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="vncipport">VNC IP:Port</label>
                                <div class="col-sm-9 input-group">
                                    <input id="vncipport" type="text" class="form-control form-control-sm" :value="masterIp + ':' + vncPort" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="vncip">IP to grant VNC access</label>
                                <div class="col-sm-9 input-group">
                                    <input id="vncip" v-model="myip" type="text" class="form-control form-control-sm" />
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Grant VNC Access to IP" class="btn btn-sm btn-order px-3 py-2" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
