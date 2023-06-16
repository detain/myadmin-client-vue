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

//const id = ref('');
const csrfToken = ref('');
const ip = ref('');
const newIp = ref(''); // Data binding for the "new_ip" input field
function handleSubmit(event) {
      event.preventDefault();
      // Handle the form submission here
      // You can access the submitted values using this.id, this.csrfToken, and this.newIp
    }
</script>

<template>
 <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-map-marker-alt">&nbsp;</i>Change IP Address
            </h3>
            <div class="card-tools float-right">
              <router-link :to="'/licenses/'+props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit="handleSubmit">
            <input type="hidden" name="link" value="change_ip">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <div class="form-group">
              <div class="form-group row">
                <label class="col-md-2" for="os">Current IP</label>
                <div class="col-sm-10 input-group">
                  <input name="old_ip" class="form-control form-control-sm" :value="ip" disabled>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-2" for="os">New IP</label>
                <div class="col-sm-10 input-group">
                  <input name="new_ip" class="form-control form-control-sm" v-model="newIp">
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="controls col-md-12" style="text-align: center;">
                  <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
                </div>
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
