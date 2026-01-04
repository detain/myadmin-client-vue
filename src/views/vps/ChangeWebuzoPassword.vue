<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const goBackLink = ref('');
const hostname = ref('');
const ip = ref('');
const ima = ref('');
onMounted(() => {});
function submitForm() {
    // Perform logic for form submission
}
</script>

<template>
    <div class="row justify-content-center py-3">
        <div class="col-md-6">
            <div class="card b-radius">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-key">&nbsp;</i>Change Webuzo Admin Password</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form class="change_rootpass" @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="change_webuzo_password" />
                        <div class="form-group mb-0">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="os">Hostname</label>
                                <div class="col-sm-9 input-group">
                                    <input id="hostname" type="text" class="form-control form-control-sm" name="hostname" :value="hostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="os">IP</label>
                                <div class="col-sm-9 input-group">
                                    <input id="ip" type="text" class="form-control form-control-sm" name="ip" :value="ip" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password">New Password</label>
                                <div class="col-sm-9 input-group">
                                    <input id="password" type="password" class="pr-password form-control form-control-sm" name="password" required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password2">Confirm password</label>
                                <div class="col-sm-9 input-group">
                                    <input id="password2" type="password" class="pr-password form-control form-control-sm" name="password2" required />
                                </div>
                            </div>
                            <template v-if="ima === 'client'">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="password2">Our Portal Login Password</label>
                                    <div class="col-sm-9 input-group">
                                        <input id="login_password" type="password" class="pr-password form-control form-control-sm" name="login_password" required />
                                    </div>
                                </div>
                            </template>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="change_webuzo_pass" value="Change Password" class="btn btn-order px-4 py-2 text-sm" />
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
