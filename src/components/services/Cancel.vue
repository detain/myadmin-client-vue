<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useSiteStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
siteStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
siteStore.addBreadcrum('/vps/'+props.id+'/', '');

</script>

<template>
    <div class='container'>
        <div class='row'>
            <div class='offset-lg-2 col-lg-8 col-md-12 col-sm-12 my-5'>
                <div class='card'>
                    <div class='card-header'>
                        <h4 class='m-0 card-title text-left'>Cancel Websites Service</h4>
                    </div>
                    <div class='card-body'>
                        <form class='form-horizontal text-left' role='form' method='POST' >
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label'>Websites ID:</label>
                                <div class='col-sm-7 col-form-label' style='text-align: left;'>376473
                                </div>
                            </div>
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label'>Type:</label>
                                <div class='col-sm-7 col-form-label' style='text-align: left;'>Standard Web Hosting
                                </div>
                            </div>
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label'>Hostname:</label>
                                <div class='col-sm-7 col-form-label' style='text-align: left;'>fancytush.com
                                </div>
                            </div>
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label'>Username:</label>
                                <div class='col-sm-7 col-form-label' style='text-align: left;'>fancytus
                                </div>
                            </div>
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label' for='confirm'>Are you sure you want to cancel?</label>
                                <div class='col-sm-7' style='text-align: left;'>
                                    <div class='ui-select'>
                                        <select id='confirm' name='confirm' class='form-control'>
                                            <option value='no'>No</option>
                                            <option value='yes'>Yes, Cancel the Websites Order</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class='form-group row'>
                                <label class='col-sm-5 col-form-label' for='comment' style='font-weight: normal;'>Reason for Cancellation/Comment:</label>
                                <div class='col-sm-7' style='text-align: left;'>
                                    <textarea class='form-control' rows='2' id='comment'></textarea>
                                </div>
                            </div>
                            <div class='card-footer'>
                                <div class='form-group row m-0'>
                                    <div class='col-sm-12 text-center'>
                                        <button class='btn btn-md btn-success' type='submit'>Continue</button>
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

<style scoped>
</style>
