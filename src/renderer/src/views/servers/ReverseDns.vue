<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

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
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
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
                console.log('vps update reverse dns success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('vps update reverse dns  failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/reverse_dns`).then((response) => {
    console.log('Response:');
    console.log(response);
    ips.value = response.ips;
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-atlas">&nbsp;</i>Reverse DNS Settings</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning" role="alert">Changes to reverse dns take up to an hour to show up.</div>
                    <form id="reverse_dns_form" accept-charset="UTF-8" role="form" method="POST" @submit.prevent="submitForm">
                        <div class="form-group row">
                            <label class="col-md-3 col-form-label">IP Addresses</label>
                            <div class="col-sm-9 input-group">
                                <label class="col-md-9 col-form-label">Hostnames</label>
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
                                <input type="submit" value="Update Reverse DNS" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
