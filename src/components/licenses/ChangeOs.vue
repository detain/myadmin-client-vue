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
layoutStore.setBreadcrums({'/home': 'Home', '/licenses': 'Licenses'})
layoutStore.addBreadcrum('/licenses/'+props.id, 'View License '+props.id);
layoutStore.addBreadcrum('/licenses/'+props.id+'/', '');


export default {
  setup() {
    const id = ref('{$id}');
    const csrfToken = ref('{$csrf_token}');
    const licenseType = ref('{$license_type}');
    const lid = ref('{$lid}');
    const osList = ref({$os_list});
    const existingOS = ref('{$existing_os}');
    const selectedOS = ref(existingOS.value);

    const submitForm = () => {
      // Handle form submission logic here
    };

    return {
      id,
      csrfToken,
      licenseType,
      lid,
      osList,
      existingOS,
      selectedOS,
      submitForm
    };
  }
};
</script>

<template>
 <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-linux"></i>Change OS
            </h3>
            <div class="card-tools float-right">
              <a href="view_license?id={{ id }}" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back">
                <i class="fa fa-arrow-left"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitForm" method="POST" :action="'view_licenses?id=' + id">
            <input type="hidden" name="link" value="change_os">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <input type="hidden" name="license_type" :value="licenseType">
            <input type="hidden" name="lid" :value="lid">
            <div class="form-group row">
              <label class="col-md-3" for="os">Select License OS</label>
              <div class="col-sm-9 input-group">
                <select name="os" class="form-control form-control-sm select2" v-model="selectedOS">
                  <option v-for="(os, value) in osList" :key="value" :value="value" :selected="existingOS === value">{{ os }}</option>
                </select>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="controls col-md-12" style="text-align: center;">
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
