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
layoutStore.setBreadcrums({'/home': 'Home', '/domains': 'Domains'})
layoutStore.addBreadcrum('/domains/'+props.id, 'View Domain '+props.id);
layoutStore.addBreadcrum('/domains/'+props.id+'/', '');

//const id = ref('');
const ima = ref('');
const custid = ref('');
const csrfToken = ref('');
const tabIndex = ref(0);
const formFields = ref({});
const domainFields = ref({});

const updateContact = () => {
  // Handle contact update logic here
};

</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fas fa-address-card"></i>&nbsp;Contact Information
            </h3>
            <div class="card-tools float-right">
              <router-link :to="'/domains/'+props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="updateContact" method="POST" :action="'view_domain?id=' + id + '&link=contact' + (ima === 'admin' ? '&custid=' + custid : '')">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <div v-for="(field, fieldName) in formFields" :key="fieldName" class="form-group row">
              <template v-if="domainFields[fieldName].label && domainFields[fieldName].label">
                <label class="col-sm-3 col-form-label" :for="fieldName">{{ domainFields[fieldName].label }}<span v-if="domainFields[fieldName].required" class="text-danger"> *</span></label>
              </template>
              <div class="col-sm-9 input-group">
                <template v-if="domainFields[fieldName].input === 'text'">
                  <input type="text" :name="fieldName" class="form-control form-control-sm" :value="domainFields[fieldName].value" :tabindex="++tabIndex">
                </template>
                <template v-else-if="domainFields[fieldName].input && domainFields[fieldName].input[0] === 'select'">
                  <select :name="fieldName" class="form-control form-control-sm select2" :tabindex="++tabIndex">
                    <option v-for="(displayName, val, index) in domainFields[fieldName].input[1]" :key="index" :value="val" :selected="domainFields[fieldName].value === val">{{ displayName }}</option>
                  </select>
                </template>
                <template v-if="domainFields[fieldName].tip">
                  <div class="input-group-append">
                    <span style="cursor: pointer;" class="input-group-text" data-toggle="popover" data-container="body" data-html="true"
                      :data-content="`<p style='text-align: left;'>${domainFields[fieldName].tip}</p>`"
                      :data-original-title="`<div style='text-align: left; font-weight: bold;'>Tip for ${domainFields[fieldName].label}</div>`">
                      <i class="fa text-info fa-question"></i>
                    </span>
                  </div>
                </template>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 text-center">
                <input type="submit" name="Submit" value="Update" class="btn btn-custom btn-md py-2 px-4">
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
