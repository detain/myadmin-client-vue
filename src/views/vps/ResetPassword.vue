<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

const props = defineProps({
    module: String,
    id: Number,
});
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module || '';
});
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const server = ref('');
const goBackLink = computed(() => {
    return `${module.value === 'vps' ? 'view_' + module.value : 'view_qs'}?id=${id.value}`;
});
function submitForm() {
    // Handle form submission
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title d-flex py-2"><i class="material-icons">password&nbsp;</i> Reset VPS Password</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="reset_password" />

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label for="slices" class="col-form-label">Server</label>
                                </div>
                                <div class="col-md-9">
                                    <input name="server" type="text" class="form-control form-control-sm" readonly :value="server" />
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label for="slices" class="col-form-label">Important Note</label>
                                </div>
                                <div class="col-md-9">
                                    <textarea class="form-control form-control-sm" readonly style="height: 140px">Windows password reset will result in an unclean shut down. Please consider this a last resort option. Verify in VNC that no updates are currently running. If an update is running VNC will show: Windows is applying updates, do not shut down. Shutting down in this state can result in an unbootable machine.</textarea>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="input-group">
                                <div class="icheck-success col-md-12 text-bold mt-3 text-black">
                                    <input id="confirmation" type="checkbox" name="confirm" value="yes" required />
                                    <label for="confirmation">I want to Reset the Password!</label>
                                </div>
                            </div>
                        </div>

                        <div class="row justify-content-center">
                            <div class="controls">
                                <button name="reset_pass" type="submit" class="btn btn-sm btn-order px-3 py-2">Reset Password</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
