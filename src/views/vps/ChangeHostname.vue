<script setup lang="ts">
import fetchWrapper from '@/helpers/fetchWrapper.ts';
import moduleLink from '@/helpers/moduleLink.ts';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import useSiteStore from '@/stores/site.store.ts';

const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const hostname = ref('');
const newHostname = ref('');
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});

function getLink() {
    if (module.value === 'vps') {
        return `view_${module.value}?id=${id.value}`;
    } else {
        return 'view_qs';
    }
}
function submitForm() {
    const formData = {
        link: 'changeHostname',
        hostname: newHostname,
    };
    // Process the form submission or make an API request here
}
</script>

<template>
    <div class="row justify-content-center py-4">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title"><i class="material-icons pr-1" style="vertical-align: bottom">manage_accounts</i>Change VPS Hostname</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm"><i class="fa fa-arrow-left"></i> Back</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form v-on:submit.prevent="submitForm" class="change_hostname">
                        <input type="hidden" name="link" value="changeHostname" />
                        <div class="form-group mb-0">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="oldhostname">Existing Hostname</label>
                                <div class="col-sm-9 input-group">
                                    <input type="text" class="form-control form-control-sm" id="oldhostname" name="oldhostname" :value="hostname" disabled />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label" for="hostname">New Hostname</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control form-control-sm" id="hostname" name="hostname" placeholder="your.server.com" v-model="newHostname" />
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
