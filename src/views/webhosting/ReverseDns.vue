<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import { moduleLink } from '@/helpers/moduleLink.ts';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

const props = defineProps(['id']);
//const id = ref('');
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref<Fields>({});
const module: string = 'webhosting';
const siteStore = useSiteStore();

interface Fields {
    [key: string]: {
        help_text: string;
        name: string;
        value: string;
    };
}

function submitForm() {
    // Perform necessary form submission logic here
}
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
                    <form @submit.prevent="submitForm" method="POST">
                        <input type="hidden" name="link" value="reverse_dns" />
                        <template v-for="(field_details, field_name, index) in fields" :key="index">
                            <template v-if="field_details.help_text">
                                <div class="alert alert-success">{{ field_details.help_text }}</div>
                            </template>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">{{ field_name }}</label>
                                <div class="col-sm-9 input-group">
                                    <input type="text" class="form-control form-control-sm" :id="field_details.name" name="host_name" :value="field_details.value" required />
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
