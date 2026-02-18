<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { ref, computed, onMounted } from 'vue';
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
const password = ref('');
const password2 = ref('');
const login_password = ref('');
const id = computed(() => props.id);
const module = computed(() => props.module);
const curHostname = computed(() => props.curHostname);

onMounted(() => {});

function submitForm() {
    if (password.value != password2.value) {
        Swal.fire({
            icon: 'error',
            html: `Password and Confirm Password do not match`,
        });
        return;
    }
    let postData = {
        password: password.value,
        login_password: login_password.value,
    };
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/change_webuzo_password`, postData)
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
    <div class="row justify-content-center py-3">
        <div class="col-md-6">
            <div class="card b-radius">
                <ServiceActionCardHeader title="Change Webuzo Admin Password" icon-class="fa fa-key" :back-to="'/' + moduleLink(module) + '/' + props.id" />
                <div class="card-body">
                    <form class="change_rootpass" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="change_webuzo_password" />
                        <div class="form-group mb-0">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="os">Hostname</label>
                                <div class="col-sm-9 input-group">
                                    <input id="hostname" type="text" class="form-control form-control-sm" name="hostname" :value="curHostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password">New Password</label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="password" type="password" class="pr-password form-control form-control-sm" required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password2">Confirm password</label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="password2" type="password" class="pr-password form-control form-control-sm" required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password2">Our Portal Login Password</label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="login_password" type="password" class="pr-password form-control form-control-sm" required />
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" value="Change Password" class="btn btn-order px-4 py-2 text-sm" />
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
