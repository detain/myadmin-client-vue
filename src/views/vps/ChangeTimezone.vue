<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { VpsInfo } from '../../types/vps';
import { QsInfo } from '../../types/qs';

import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>()
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const timezone = ref('America/New_York');
const zones = ref<string[]>([]);
function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_timezone`, {
                timezone: timezone.value,
            })
            .then((response) => {
                Swal.close();
                console.log('vps change timezone success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('vps change timezone failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_timezone`).then((response) => {
    console.log('Response:');
    console.log(response);
    zones.value = response;
});
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-12">
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0">
                    <i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #1:</b>&nbsp;You should turn your <b>{{ module }}</b> off completely before changing the time zone.
                </p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <p></p>
            </div>
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #2:</b>&nbsp;VPS will be <b>Powered OFF</b> and restarted during the process.</p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <p></p>
            </div>
            <div class="card w-100 mb-4 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0"><i class="fas fa-info-circle text-red" style="color: red" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #3:</b>&nbsp;The timezone on this page will always default to <b>America/New_York</b> regardless of what your server is set to.</p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times" aria-hidden="true"></i></button>
                </div>
                <p></p>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="py-2">
                        <h3 class="card-title"><i class="material-icons mb-1 pr-2" style="vertical-align: middle">alarm</i>Change {{ module }} Timezone</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pb-0">
                    <form class="change_timezone" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="change_timezone" />
                        <div class="form-group">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label text-right" for="os">Select Timezone</label>
                                <div class="col-sm-9 input-group">
                                    <select v-model="timezone" name="timezone" class="form-control select2">
                                        <option v-for="(zone, index) in zones" :key="index" :value="zone">{{ zone }}</option>
                                    </select>
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Change Zone" class="btn btn-sm btn-order px-3 py-2" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
