<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useLayoutStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const layoutStore = useLayoutStore();
layoutStore.setTitle('');
layoutStore.setPageHeading('');
layoutStore.setBreadcrums({'/home': 'Home', '/ssl': 'SSL'})
layoutStore.addBreadcrum('/ssl/'+props.id, 'View SSL '+props.id);
layoutStore.addBreadcrum('/ssl/'+props.id+'/', '');

//const id = ref(''); // Replace with appropriate data or pass as props
const csrf_token = ref(''); // Replace with appropriate data or pass as props
const approver_select = ref([]); // Replace with appropriate data or pass as props
const selectedApproverEmail = ref(''); // Stores the selected approver email
const service_info = ref({});
function submitForm() {
      // Perform necessary form submission logic here
    }
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-envelope">&nbsp;</i>Change Approver Email
            </h3>
            <div class="card-tools float-right">
              <router-link :to="'/ssl/'+props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitForm" action="view_ssl?id={{ id }}&link=change_approver_email" method="POST">
            <input type="hidden" name="link" value="change_approver_email">
            <input type="hidden" name="csrf_token" :value="csrf_token">
            <div class="form-group row">
              <label class="col-md-4 col-form-label text-right" for="hostname">Hostname</label>
              <div class="col-sm-8">
                <input type="text" class="form-control form-control-sm" id="hostname" name="hostname"
                  :value="service_info.ssl_hostname" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-4 col-form-label text-right" for="approver_email">Select Approver Email</label>
              <div class="col-sm-8">
                <select name="approver_email" class="form-control form-control-sm select2" v-model="selectedApproverEmail">
                  <option v-for="approverEmail in approver_select" :key="approverEmail" :value="approverEmail" :selected="service_info.ssl_approver_email === approverEmail">{{ approverEmail }}</option>
                </select>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="controls col-md-12 text-center">
                <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
