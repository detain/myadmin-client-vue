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
layoutStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
layoutStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
layoutStore.addBreadcrum('/vps/'+props.id+'/', '');

export default {
  data() {
    return {
      distroSelect: {},
      bitsSelect: {},
      templateSelect: {},
      currentOS: "",
      successMsg: "",
      cancelQueue: "",
      checkVpsPassword: true,
      checkAccountPassword: true,
      csrf: ""
    };
  },
  computed: {
    goBackLink() {
      if (this.module === "vps") {
        return `view_${this.module}`;
      } else {
        return "view_qs";
      }
    },
    formAction() {
      return `${this.module === "vps" ? "view_vps" : "view_qs"}?id=${this.id}&link=reinstall_os`;
    }
  },
  mounted() {
    this.distroSelect = vps_templates.distroSelect;
    this.bitsSelect = vps_templates.bitsSelect;
    this.templateSelect = vps_templates.templateSelect;
    this.currentOS = vps_templates.currentOS;
    this.successMsg = vps_templates.success_msg;
    this.cancelQueue = vps_templates.cancel_queue;
    this.checkVpsPassword = vps_templates.checkVpsPassword === true;
    this.checkAccountPassword = vps_templates.checkAccountPassword === true;
    this.csrf = vps_templates.csrf;
  },
  methods: {
    updateVPS() {
      // Perform logic for updating VPS based on selected values
    },
    submitForm() {
      // Handle form submission
    }
  }
};
</script>

<template>
  <div>
    <div class="row mt-2">
      <div class="col-md-12">
        <div class="card shadow-none w-100 bg-white p-2 mb-2" style="border-left: 4px solid red;display: block ruby;">
          <p class="m-0 text-md">
            <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">
              Important Note #1:</b>&nbsp;Re-installing the operating system will delete all data.
          </p>
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="remove">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
          <p></p>
        </div>
        <div class="card shadow-none w-100 bg-white p-2 mb-4" style="border-left: 4px solid red;display: block ruby;">
          <p class="m-0 text-md">
            <i class="fas fa-info-circle text-red" style="color: red;" aria-hidden="true"></i>&nbsp;<b class="text-red">
              Important Note #2:</b>&nbsp;Before Re-installing the operating system kindly take a backup.
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
      <div class="col-md-9">
        <div class="card">
          <div class="card-header">
            <div class="p-1">
              <h3 class="card-title py-2"><i class="fa fa-linux">&nbsp;</i>Reinstall OS</h3>
              <div class="card-tools text-right">
                <a :href="goBackLink" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                  <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;
                </a>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="successMsg" class="alert alert-success">{{ successMsg }} <span v-if="cancelQueue">{{ cancelQueue }}</span></div>
            <form @submit.prevent="submitForm" :action="formAction" class="reinstall_os">
              <input type="hidden" name="link" value="reinstall_os">
              <input type="hidden" name="csrf_token" :value="csrf">

              <div class="form-group">
                <div class="form-group row">
                  <label class="col-md-3 col-form-label" for="os">Current OS</label>
                  <div class="col-sm-9 input-group">
                    <input type="text" class="form-control form-control-sm" id="os" name="current_os" :value="currentOS" disabled>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-3 col-form-label" for="vps_distro">Operating System Distribution</label>
                  <div class="col-sm-9 input-group">
                    <select id="vps_distro" name="vps_distro" class="form-control form-control-sm select2" @change="updateVPS">
                      <option v-for="(distro, ky) in distroSelect" :value="ky" :selected="distro.selected">{{ distro.val }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-3 col-form-label" for="bits">Architecture</label>
                  <div class="col-sm-9 input-group">
                    <select id="bits" name="bits" @change="updateVPS" class="form-control form-control-sm select2">
                      <option v-for="(bit, ky) in bitsSelect" :value="ky" :selected="bit.selected">{{ bit.val }}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-3 col-form-label" for="template">Version</label>
                  <div class="col-sm-9 input-group">
                    <select id="template" name="template" class="form-control form-control-sm select2">
                      <option v-for="(template, ky) in templateSelect" :value="ky" :selected="template.selected">{{ template.val }}</option>
                    </select>
                  </div>
                </div>

                <div v-if="checkVpsPassword">
                  <div class="form-group row">
                    <label class="col-md-3 col-form-label" for="password">New Password</label>
                    <div class="col-sm-9 input-group">
                      <input type="password" class="pr-password form-control form-control-sm" id="password" name="password" required>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-md-3 col-form-label" for="password2">Confirm password</label>
                    <div class="col-sm-9 input-group">
                      <input type="password" class="pr-password form-control form-control-sm" id="password2" name="password2" required>
                    </div>
                  </div>
                </div>

                <div v-if="checkAccountPassword">
                  <div class="form-group row">
                    <label class="col-md-3 col-form-label" for="passwd">Login Password</label>
                    <div class="col-sm-9 input-group">
                      <input type="password" class="form-control form-control-sm" id="passwd" name="passwd" required>
                    </div>
                  </div>
                </div>

                <div class="form-group row">
                  <div class="input-group">
                    <div class="icheck-success col-md-12 text-bold text-black mt-3">
                      <input id="confirmation" type="checkbox" name="confirm" value="yes" required>
                      <label for="confirmation">I want to Re-install the OS!</label>
                    </div>
                  </div>
                </div>
                <hr>
                <div class="form-group row justify-content-center">
                  <div class="controls col-md-12" style="text-align: center;">
                    <input type="submit" name="Submit" value="Confirm Reinstall OS" class="btn btn-sm btn-order py-2 px-3" />
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