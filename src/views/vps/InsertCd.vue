<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useSiteStore } from '@/stores';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
siteStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
siteStore.addBreadcrum('/vps/'+props.id+'/', '');

const action = ref('');
const module = ref(props.module);
//const id = ref('');
const goBackLink = ref('');
const csrfToken = ref('');
const protocols = ref('https');
const links = ref(['https://templates.is.cc/knoppix/KNOPPIX_V9.1CD-2021-01-25-EN.iso', 'https://templates.is.cc/systemrescuecd/systemrescue-7.01-amd64.iso']);
function submitForm(event) {
      // Handle form submission
      event.preventDefault();
      // Perform logic for form submission
    }
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-compact-disc">&nbsp;</i>
              {{ action === 'enable_cd' ? 'Enable CDROM Drive' : 'Insert ISO Image In CDROM Drive' }}
            </h3>
            <div class="card-tools text-right">
              <router-link :to="'/vps/'+props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <form @submit="submitForm">
            <input type="hidden" name="link" value="insert_cd">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <div class="form-group">
              <div class="row">
                <div class="col-md-3">
                  <label for="slices" class="col-form-label">Allowed Protocols</label>
                </div>
                <div class="col-md-9">
                  <input type="text" class="form-control form-control-sm" readonly :value="protocols">
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-3">
                <label for="image" class="col-form-label">Choose Image</label>
              </div>
              <div class="col-sm-9 input-group">
                <select id="image" name="image" class="form-control form-control-sm select2">
                  <option v-for="(link,index) in links" :key="index" :value="link">{{ link }}</option>
                </select>
              </div>
            </div>
            <hr>
            <h5 class="text-sm text-center text-bold">OR</h5>
            <hr>
            <div class="form-group">
              <div class="row">
                <div class="col-md-3">
                  <label for="slices" class="col-form-label">Enter URL</label>
                </div>
                <div class="col-md-9">
                  <input type="text" name="url" class="form-control form-control-sm" placeholder="Enter a CD or DVD ISO URL">
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="input-group">
                <div class="col-md-3">&nbsp;</div>
                <div class="icheck-success col-md-9 text-bold text-black mt-3">
                  <input id="confirmation" type="checkbox" name="confirm" value="yes" required>
                  <label for="confirmation">Are you sure?</label>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="controls">
                <button name="insert_cd" type="submit" class="btn btn-sm btn-order px-3 py-2">Continue</button>
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
