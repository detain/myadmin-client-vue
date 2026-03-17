<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const { t } = useI18n();

const props = defineProps<{
    id: number;
}>();
const module: string = 'servers';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const ips = ref<IpMap>({});

type IpMap = Record<string, string | boolean>;

function submitForm() {
    Swal.fire({
        title: '',
        html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/reverse_dns`, {
                ips: ips.value,
            })
            .then((response) => {
                Swal.close();
                console.log('vps update reverse dns success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('vps update reverse dns  failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/reverse_dns`).then((response) => {
    console.log('Response:', response);
    ips.value = response.ips;
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-atlas"></i>{{ t('servers.reverseDns.title') }}</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning" role="alert">{{ t('servers.reverseDns.changeWarning') }}</div>
                    <form id="reverse_dns_form" accept-charset="UTF-8" role="form" method="POST" @submit.prevent="submitForm">
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">{{ t('servers.reverseDns.ipAddresses') }}</label>
                            <div class="col-sm-9 input-group">
                                <label class="col-md-9 col-form-label">{{ t('servers.reverseDns.hostnames') }}</label>
                            </div>
                        </div>
                        <div v-for="(v, k) in ips" :key="k" class="form-group row">
                            <label class="col-md-3 col-form-label">{{ k }}</label>
                            <div class="col-sm-9 input-group">
                                <input :id="k" v-model="ips[k]" :name="k" type="text" class="form-control form-control-sm" />
                            </div>
                        </div>
                        <hr />
                        <div class="form-group row">
                            <div class="controls col-md-12 text-center">
                                <input type="submit" :value="t('servers.reverseDns.updateReverseDns')" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
