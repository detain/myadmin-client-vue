<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { VpsInfo } from '@/types/vps';
import { QsInfo } from '@/types/qs';

import Swal from 'sweetalert2';
import ServiceActionCardHeader from '@/components/services/ServiceActionCardHeader.vue';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
    serviceInfo: VpsInfo | QsInfo;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const module = computed(() => props.module);
const timezone = ref('America/New_York');
const zones = ref<string[]>([]);
async function submitForm() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${  t('vps.changeTimezone.pleaseWait')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });

    try {
        const response = await fetchWrapper.post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_timezone`, {
            timezone: timezone.value,
        });

        Swal.close();
        console.log('vps change timezone success', response);
        Swal.fire({
            icon: 'success',
            html: t('vps.changeTimezone.success', { text: response.text }),
        });
    } catch (error: any) {
        Swal.close();
        console.log('vps change timezone failed', error);
        Swal.fire({
            icon: 'error',
            html: t('vps.changeTimezone.gotError', { message: error.message }),
        });
    }
}

let response;
try {
    response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_timezone`);
    console.log('Response:', response);
    zones.value = response;
} catch (error: any) {
    console.log('vps fetch timezone list failed', error);
    Swal.fire({
        icon: 'error',
        html: t('vps.changeTimezone.gotError', { message: error.message }),
    });
}
</script>

<template>
    <div class="row mt-2">
        <div class="col-md-12">
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0">
                    <font-awesome-icon :icon="['fas', 'info-circle']" class="text-red" style="color: red" />&nbsp;<b class="text-red">{{ t('vps.common.importantNoteLabel', { number: 1 }) }}</b>&nbsp;{{ t('vps.changeTimezone.importantNote1', { module: module }) }}
                </p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><font-awesome-icon :icon="['fas', 'times']" /></button>
                </div>
                <p></p>
            </div>
            <div class="card w-100 mb-2 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0"><font-awesome-icon :icon="['fas', 'info-circle']" class="text-red" style="color: red" />&nbsp;<b class="text-red">{{ t('vps.common.importantNoteLabel', { number: 2 }) }}</b>&nbsp;{{ t('vps.changeTimezone.importantNote2') }}</p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><font-awesome-icon :icon="['fas', 'times']" /></button>
                </div>
                <p></p>
            </div>
            <div class="card w-100 mb-4 bg-white p-2 shadow-none" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
                <p class="text-md m-0"><font-awesome-icon :icon="['fas', 'info-circle']" class="text-red" style="color: red" />&nbsp;<b class="text-red">{{ t('vps.common.importantNoteLabel', { number: 3 }) }}</b>&nbsp;{{ t('vps.changeTimezone.importantNote3') }}</p>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><font-awesome-icon :icon="['fas', 'times']" /></button>
                </div>
                <p></p>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <ServiceActionCardHeader :title="t('vps.changeTimezone.title', { module: module })" material-icon="alarm" :back-to="'/' + moduleLink(module) + '/' + props.id" />
                <div class="card-body pb-0">
                    <form class="change_timezone" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="change_timezone" />
                        <div class="form-group">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label text-right" for="os">{{ t('vps.changeTimezone.selectTimezone') }}</label>
                                <div class="col-sm-9 input-group">
                                    <select v-model="timezone" name="timezone" class="form-control select2">
                                        <option v-for="(zone, index) in zones" :key="index" :value="zone">{{ zone }}</option>
                                    </select>
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" :value="t('vps.changeTimezone.changeZone')" class="btn btn-sm btn-order px-3 py-2" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped />
