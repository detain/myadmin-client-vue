<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const module: string = 'licenses';
const siteStore = useSiteStore();

//const id = ref('');
const licenseType = ref('');
const lid = ref('');
const osList = ref({});
const existingOS = ref('');
const selectedOS = ref(existingOS.value);

function submitForm() {
    // Handle form submission logic here
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-linux"></i>Change OS</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i></router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm" method="POST" :action="'view_licenses?id=' + id">
                        <input type="hidden" name="link" value="change_os" />
                        <input type="hidden" name="license_type" :value="licenseType" />
                        <input type="hidden" name="lid" :value="lid" />
                        <div class="form-group row">
                            <label class="col-md-3" for="os">Select License OS</label>
                            <div class="col-sm-9 input-group">
                                <select name="os" class="form-control form-control-sm select2" v-model="selectedOS">
                                    <option v-for="(os, value) in osList" :key="value" :value="value" :selected="existingOS === value">{{ os }}</option>
                                </select>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="controls col-md-12" style="text-align: center">
                                <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
