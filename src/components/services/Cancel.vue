<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { fetchWrapper, moduleLink } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
import Swal from 'sweetalert2';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const { modules } = storeToRefs(siteStore);
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});
const settings = computed(() => {
    return modules.value[module.value];
});

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/'+moduleLink(module.value), 'VPS'],
]);
siteStore.addBreadcrum('/'+moduleLink(module.value)+'/' + id.value, 'View '+module.value+' ' + id.value);
siteStore.addBreadcrum('/'+moduleLink(module.value)+'/' + id.value + '/cancel', 'Cancel '+module.value);


onMounted(() => {
});

function onSubmit() {
    Swal.fire({
        icon: 'error',
        title: '<h3>Cancel '+module.value+'</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: '<p>Are you sure want to cancel your '+module.value+' <span class="text-2lg">'+id.value+'</span>?</p>',
        preConfirm: () => {
            try {
                fetchWrapper.get(baseUrl+'/'+moduleLink(module.value)+'/'+id.value+'/cancel').then((response) => {
                    console.log(module.value+' cancel success');
                    console.log(response);
                });
            } catch (error: any) {
                console.log(module.value+' cancel failed');
                console.log(error);
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
                        <h4 class="card-title m-0 text-left">Cancel {{settings?.TITLE}} Service</h4>
                    </div>
                    <div class="card-body">
                        <form id="cancelForm" class="form-horizontal text-left" role="form" method="POST" @submit.prevent="onSubmit">
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">{{settings?.TBLNAME}} ID:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">376473</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Type:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">Standard Web Hosting</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Hostname:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">fancytush.com</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label">Username:</label>
                                <div class="col-sm-7 col-form-label" style="text-align: left">fancytus</div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label" for="confirm">Are you sure you want to cancel?</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <div class="ui-select">
                                        <select id="confirm" name="confirm" class="form-control">
                                            <option value="no">No</option>
                                            <option value="yes">Yes, Cancel the {{settings?.TBLNAME}} Order</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-sm-5 col-form-label" for="comment" style="font-weight: normal">Reason for Cancellation/Comment:</label>
                                <div class="col-sm-7" style="text-align: left">
                                    <textarea class="form-control" rows="2" id="comment"></textarea>
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
