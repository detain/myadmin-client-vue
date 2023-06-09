<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useLayoutStore } from '@/stores';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const layoutStore = useLayoutStore();
layoutStore.setTitle('');
layoutStore.setPageHeading('');
layoutStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
layoutStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
layoutStore.addBreadcrum('/vps/'+props.id+'/', '');

const module = ref('');
const goBackLink = ref('');
const csrfToken = ref('');
const zones = ref([]);
function submitForm(event) {
  event.preventDefault();
  // Perform form submission logic
}
</script>

<template>
  <div class="row mt-2">
    <div class="col-md-12">
      <div class="card shadow-none w-100 bg-white p-2 mb-2" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
        <p class="m-0 text-md">
          <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #1:</b>&nbsp;You should turn your <b>{{ module }}</b> off completely before changing the time zone.
        </p>
        <div class="card-tools float-right">
          <button type="button" class="btn btn-tool" data-card-widget="remove">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <p></p>
      </div>
      <div class="card shadow-none w-100 bg-white p-2 mb-2" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
        <p class="m-0 text-md">
          <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #2:</b>&nbsp;VPS will be <b>Powered OFF</b> and restarted during the process.
        </p>
        <div class="card-tools float-right">
          <button type="button" class="btn btn-tool" data-card-widget="remove">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <p></p>
      </div>
      <div class="card shadow-none w-100 bg-white p-2 mb-4" :style="{ 'border-left': '4px solid red', display: 'block ruby' }">
        <p class="m-0 text-md">
          <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">Important Note #3:</b>&nbsp;The timezone on this page will always default to <b>America/New_York</b> regardless of what your server is set to.
        </p>
        <div class="card-tools float-right">
          <button type="button" class="btn btn-tool" data-card-widget="remove">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <p></p>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="py-2">
            <h3 class="card-title"><i class="material-icons pr-2 mb-1" style="vertical-align: middle;">alarm</i>Change {{ module }} Timezone</h3>
            <div class="card-tools float-right">
              <a class="btn btn-custom btn-sm" :href="goBackLink" data-toggle="tooltip" title="Go Back">
                <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>
        <div class="card-body pb-0">
          <form @submit="submitForm" class="change_timezone">
            <input type="hidden" name="link" value="change_timezone">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <div class="form-group">
              <div class="form-group row">
                <label class="col-md-3 col-form-label text-right" for="os">Select Timezone</label>
                <div class="col-sm-9 input-group">
                  <select name="timezone" class="form-control select2">
                    <option v-for="(zone,index) in zones" :key="index" :value="zone" :selected="zone === 'America/New_York'">{{ zone }}</option>
                  </select>
                </div>
              </div>
              <hr>
              <div class="row justify-content-center">
                <div class="controls col-md-12" style="text-align: center;">
                  <input type="submit" name="Submit" value="Change Zone" class="btn btn-sm btn-order px-3 py-2" />
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
