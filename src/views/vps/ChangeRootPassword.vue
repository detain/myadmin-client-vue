<script setup lang="ts">
import { fetchWrapper, moduleLink } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const module = computed(() => { return props.module; });
const goBackLink = ref('');
const hostname = ref('');

function submitForm() {
    // Perform form submission logic
}
</script>

<template>
    <div class="row justify-content-center py-3">
        <div class="col-md-6">
            <div class="card b-radius">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-key">&nbsp;</i>Change VPS Root Password</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/'+moduleLink(module)+'/vps/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm" class="change_rootpass">
                        <input type="hidden" name="link" value="changeRootPassword" />
                        <div class="form-group mb-0">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="os">Server: </label>
                                <div class="col-sm-9 input-group">
                                    <input type="text" class="form-control form-control-sm" id="hostname" name="hostname" :value="hostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password">New Password: </label>
                                <div class="col-sm-9 input-group">
                                    <input type="password" class="pr-password form-control form-control-sm" id="password" name="password" required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="password2">Confirm password: </label>
                                <div class="col-sm-9 input-group">
                                    <input type="password" class="pr-password form-control form-control-sm" id="password2" name="password2" required />
                                </div>
                            </div>
                            <hr />
                            <div class="row justify-content-center">
                                <div class="controls">
                                    <input type="submit" name="change_pass" value="Change Password" class="btn btn-order px-4 py-2 text-sm" />
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
