<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores/site.store';

import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
    module: string;
    package: string | number;
    titleField: string;
    titleField2?: string;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const { modules } = storeToRefs(siteStore);
const id = computed(() => props.id);
const module = computed(() => props.module);
const pkg = computed(() => props.package);
const titleField = computed(() => props['titleField']);
const titleField2 = computed(() => props['titleField2']);
const settings = computed(() => modules.value[module.value]);

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/${moduleLink(module.value)}`, 'VPS'],
]);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}`, `View ${module.value} ${id.value}`);
siteStore.addBreadcrum(`/${moduleLink(module.value)}/${id.value}/cancel`, `Cancel ${module.value}`);

onMounted(() => {});

function onSubmit() {
    Swal.fire({
        icon: 'error',
        title: `<h3>Cancel ${module.value}</h3> `,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `<p>Are you sure want to cancel your ${module.value} <span class="text-2lg">${id.value}</span>?</p>`,
        preConfirm: () => {
            try {
                fetchWrapper.get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/cancel`).then((response) => {
                    console.log(`${module.value} cancel success`, response);
                });
            } catch (error: any) {
                console.log(`${module.value} cancel failed`, error);
            }
        },
    });
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 my-5">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title m-0 text-left">Cancel {{ settings?.TITLE }} Service</h4>
                    </div>
                    <div class="card-body">
                        <form id="cancelForm" class="form-horizontal text-left" role="form" method="POST" @submit.prevent="onSubmit">
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{ settings?.TBLNAME }} ID:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ id }}</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Type:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ pkg }}</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Hostname:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ titleField }}</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Username:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">{{ titleField2 }}</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label" for="confirm">Are you sure you want to cancel?</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <div class="ui-select">
                                        <select id="confirm" name="confirm" class="form-control">
                                            <option value="no">No</option>
                                            <option value="yes">Yes, Cancel the {{ settings?.TBLNAME }} Order</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label" for="comment" style="font-weight: normal">Reason for Cancellation/Comment:</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <textarea id="comment" class="form-control" rows="2"></textarea>
                                </div>
                            </div>
                            <div class="card-footer">
                                <div class="form-group row m-0">
                                    <div class="col-sm-12 text-center">
                                        <button class="btn btn-md btn-success" type="submit">Continue</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
