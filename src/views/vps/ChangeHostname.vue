<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import ServiceActionCardHeader from '@/components/services/ServiceActionCardHeader.vue';

const props = defineProps<{
    id: number;
    module: string;
    curHostname: string;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const hostname = ref('');
const id = computed(() => props.id);
const module = computed(() => props.module);
const curHostname = computed(() => {
    return props.curHostname;
});
function submitForm() {
    let postData = {
        hostname: hostname.value,
    };
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_hostname`, postData)
        .then((response: any) => {
            console.log('api success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        })
        .catch((error: any) => {
            console.log('api failed');
            console.log(error);
            Swal.fire({
                icon: 'error',
                html: `Got error ${error.message}`,
            });
        });
}
</script>

<template>
    <div class="row justify-content-center py-4">
        <div class="col-md-6">
            <div class="card">
                <ServiceActionCardHeader title="Change VPS Hostname" material-icon="manage_accounts" :back-to="'/' + moduleLink(module) + '/' + props.id" />
                <div class="card-body">
                    <form class="change_hostname" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="changeHostname" />
                        <div class="form-group mb-0">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="old-hostname">Existing Hostname</label>
                                <div class="col-sm-9 input-group">
                                    <input id="old-hostname" type="text" class="form-control form-control-sm" :value="curHostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="hostname">New Hostname</label>
                                <div class="col-sm-9">
                                    <input id="hostname" v-model="hostname" type="text" class="form-control form-control-sm" name="hostname" placeholder="your.server.com" />
                                    <span class="text-muted text-sm">For Example: your.server.com</span>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="Submit" value="Update Hostname" class="btn btn-sm btn-order px-3 py-2" />
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
