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
layoutStore.setBreadcrums({'/home': 'Home', '/servers': 'Servers'})
layoutStore.addBreadcrum('/servers/'+props.id, 'View Server '+props.id);
layoutStore.addBreadcrum('/servers/'+props.id+'/', '');

export default {
  data() {
    return {
      id: '', // Replace with actual data property
      aId: '', // Replace with actual data property
      assetInfo: {}, // Replace with actual data property
      clientIP: '', // Replace with actual data property
      success: '', // Replace with actual data property
      info: '', // Replace with actual data property
      error: '', // Replace with actual data property
      csrfToken: '', // Replace with actual data property
    };
  },
  computed: {
    emailIPMILink() {
      // Replace with the computed property logic to generate the link
      return `view_server?id=${this.id}&link=ipmi_live&a_id=${this.aId}&email_ipmi_cred=1`;
    },
  },
  methods: {
    submitForm() {
      // Add the form submission logic here
    },
    removeCard() {
      // Add the remove card logic here
    },
  },
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="card shadow-none w-100 bg-white p-2 mb-4" style="border-left: 4px solid #17a2b8;display: block ruby;">
      <p class="m-0 text-md">
        <i class="fas fa-info-circle text-info" aria-hidden="true">&nbsp;</i>
        <b class="text-info">
          What this does?
        </b>
        Give live IP to IPMI controller restricted to your IP and limited to 24 hours of use.
      </p>
      <div class="card-tools float-right">
        <button type="button" class="btn btn-tool" data-card-widget="remove" @click="removeCard">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      <p></p>
    </div>
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-connectdevelop">&nbsp;</i>IPMI IP
            </h3>
            <div class="card-tools float-right">
              <a class="btn btn-custom mr-3" :href="emailIPMILink"><i class="fa fa-paper-plane" aria-hidden="true">&nbsp;</i>Email IPMI Credentials</a>
              <a href="index.php?choice=none.view_server&id={{ id }}" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back">
                <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div v-if="success">
            <div class="alert alert-success">{{ success }}</div>
          </div>
          <div v-else-if="info">
            <div class="alert alert-info">{{ info }}</div>
          </div>
          <div v-else-if="error">
            <div class="alert alert-danger">{{ error }}</div>
          </div>
          <form v-if="!error" @submit.prevent="submitForm">
            <input type="hidden" name="choice" value="none.view_dedicated_server" />
            <input type="hidden" name="csrf_token" :value="csrfToken" />
            <input type="hidden" name="link" value="ipmi_live" />
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Asset ID</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="asset_id" name="asset_id" :value="aId" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Server ID</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="server_id" name="server_id" :value="assetInfo.order_id" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Hostname</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="hostname" name="hostname" :value="assetInfo.hostname" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Server IP</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="primary_ipv4" name="primary_ipv4" :value="assetInfo.primary_ipv4" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Server IPMI</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="ipmi" name="ipmi" :value="assetInfo.ipmi_ip" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label text-right">Your IP Address</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" placeholder="1.2.3.4" id="ip" name="ip" v-model="clientIP">
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