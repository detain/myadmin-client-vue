<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref<Fields>({});
const module: string = 'webhosting';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const ips = ref<IpMap>({});

type IpMap = Record<string, string | boolean>;

interface Fields {
    [key: string]: {
        help_text: string;
        name: string;
        value: string;
    };
}

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
        <div class="col-md-6 py-5">
            <div class="card b-radius my-3 shadow-none">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-atlas">&nbsp;</i>Reverse DNS</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="successMsg">
                        <div class="alert alert-success">{{ successMsg }} {{ cancelQueue }}</div>
                    </template>
                    <form method="POST" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="reverse_dns" />
                        <template v-for="(field_details, field_name, index) in fields" :key="index">
                            <template v-if="field_details.help_text">
                                <div class="alert alert-success">{{ field_details.help_text }}</div>
                            </template>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">{{ field_name }}</label>
                                <div class="col-sm-9 input-group">
                                    <input :id="field_details.name" v-model="fields[field_name]" type="text" class="form-control form-control-sm" name="host_name" required />
                                </div>
                            </div>
                        </template>
                        <div class="form-group row justify-content-center m-0">
                            <div class="controls">
                                <input type="submit" name="Submit" value="Update Reverse DNS" class="btn btn-order px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
