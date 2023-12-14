<script setup lang="ts">
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import moduleLink from '@/helpers/moduleLink.ts';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import useSiteStore from '@/stores/site.store.ts';

import Swal from 'sweetalert2';
const props = defineProps(['id', 'module', 'serviceInfo', 'serviceMaster']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => { return props.id; });
const module = computed(() => { return props.module; });
const serviceInfo = computed(() => { return props.serviceInfo; });
const serviceMaster = computed(() => { return props.serviceMaster; });
const myip = ref('');
function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(baseUrl + '/vps/' + id.value + '/setup_vnc', {
                ip: myip.value,
            })
            .then((response) => {
                Swal.close();
                console.log('vps setup vnc success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: 'Success' + response.text,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('vps setup vnc failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: 'Got error ' + error.text,
        });
    }
}

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
                                    <input type="text" class="form-control form-control-sm" id="vncname" :value="serviceInfo.vps_hostname" disabled />
                                </div>
                            </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vncserver">VPS IP</label>
                                    <div class="col-sm-9 input-group">
                                        <input type="text" class="form-control form-control-sm" id="vncserver" :value="serviceInfo.vps_ip" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vncipport">VNC IP:Port</label>
                                    <div class="col-sm-9 input-group">
                                        <input type="text" class="form-control form-control-sm" id="vncipport" :value="serviceMaster.vps_ip + ':' + serviceInfo.vps_vnc_port" disabled />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="vncip">IP to grant VNC access</label>
                                    <div class="col-sm-9 input-group">
                                        <input type="text" class="form-control form-control-sm" id="vncip" v-model="myip" />
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
