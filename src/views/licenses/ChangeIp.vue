<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    id: number;
    curIp: string;
}>();
const id = computed(() => props.id);
const curIp = computed(() => props.curIp);
const module: string = 'licenses';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const ip = ref('');
const newIp = ref(props.curIp);
function handleSubmit() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/change_ip`, {
                ip: newIp.value,
            })
            .then((response) => {
                Swal.close();
                console.log('webhosting buy ip');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('webhosting buy ip');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-map-marker-alt">&nbsp;</i>Change IP Address</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="handleSubmit">
                        <input type="hidden" name="link" value="change_ip" />
                        <div class="form-group">
                            <div class="form-group row">
                                <label class="col-md-2" for="os">Current IP</label>
                                <div class="col-sm-10 input-group">
                                    <input name="old_ip" class="form-control form-control-sm" :value="curIp" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-2" for="os">New IP</label>
                                <div class="col-sm-10 input-group">
                                    <input v-model="newIp" name="new_ip" class="form-control form-control-sm" />
                                </div>
                            </div>
                            <hr />
                            <div class="row">
                                <div class="controls col-md-12" style="text-align: center">
                                    <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
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
