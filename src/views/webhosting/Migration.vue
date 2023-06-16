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
layoutStore.setBreadcrums({'/home': 'Home', '/websites': 'Websites'})
layoutStore.addBreadcrum('/websites/'+props.id, 'View Website '+props.id);
layoutStore.addBreadcrum('/websites/'+props.id+'/', '');

const csrfToken = ref('');
const custPortal = ref('');
const regEmail = ref('');
const password = ref('');
const ctrlPanel = ref('');
const ftpUsername = ref('');
const ftpPassword = ref('');
const siteBusyMig = ref('yes');
const splReqMig = ref('no');
const domainReg = ref('yes');
const dataMig = ref('yes');
const domainRegPortal = ref('');
const domainRegEmail = ref('');
const domainRegPassword = ref('');

const submitForm = () => {
  // Handle form submission here
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-7">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2"><i class="material-icons">transfer_within_a_station&nbsp;</i>Migrate Your Website</h3>
            <div class="card-tools float-right">
              <router-link :to="'/websites/'+id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
          </div>
        </div>
        <div class="card-body pb-0">
          <form @submit.prevent="submitForm">
            <div class="card shadow-none mb-0">
              <div class="card-header">
                <div class="p-1">
                  <h3 class="card-title text-bold"><i aria-hidden="true" class="fa fa-info-circle">&nbsp;</i>Current Web Host Info</h3>
                </div>
              </div>
              <div class="card-body pb-0">
                <input type="hidden" name="csrf_token" :value="csrfToken">
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="cust_portal">Customer Portal URL</label>
                  <div class="col-md-6">
                    <input placeholder="Enter Customer Portal URL" type="text" class="form-control form-control-sm" id="cust_portal" v-model="custPortal" />
                    <small class="form-text text-muted">For Example: sso.godaddy.com</small>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 pl-0 mt-1" for="reg_email">Registered Username / Email / ID</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter Registered Username / E-mail / ID" type="text" class="form-control form-control-sm" id="reg_email" v-model="regEmail" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="pass">Password</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter Password" type="password" class="form-control form-control-sm" id="pass" v-model="password" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="ctrl_panel">Control Panel URL</label>
                  <div class="col-md-6">
                    <input placeholder="Enter Control Panel URL" type="text" class="form-control form-control-sm" id="ctrl_panel" v-model="ctrlPanel" />
                    <small class="form-text text-muted">For Example: yourdomain.com/cpanel</small>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="ftp_usrname">FTP / Control Panel Username</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter FTP / Control Panel Username" type="text" class="form-control form-control-sm" id="ftp_usrname" v-model="ftpUsername" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="ftp_pass">FTP / Control Panel Password</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter FTP / Control Panel Password" type="password" class="form-control form-control-sm" id="ftp_pass" v-model="ftpPassword" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="site_busy_mig">If the site is live/busy site having high traffic, can we set a holding page during migration?</label>
                  <div class="col-md-6 input-group">
                    <select name="site_busy_mig" class="form-control form-control-sm" v-model="siteBusyMig">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="spl_req_mig">Does this site have special requirements like PHP Version / Modules?</label>
                  <div class="col-md-6 input-group">
                    <select name="spl_req_mig" class="form-control form-control-sm" v-model="splReqMig">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="card shadow-none">
              <div class="card-header">
                <div class="p-1">
                  <h5 class="card-title text-bold"><i aria-hidden="true" class="fa fa-info-circle">&nbsp;</i>Domain Registry Information</h5>
                </div>
              </div>
              <div class="card-body">
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="domain_reg">Do you also want us to help you transfer the domain name registration?</label>
                  <div class="col-md-6 input-group">
                    <select name="domain_reg" class="form-control form-control-sm" v-model="domainReg">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="data_mig">Do you want us to update the name servers as soon as we finish the data migration?</label>
                  <div class="col-md-6 input-group">
                    <select name="data_mig" class="form-control form-control-sm" v-model="dataMig">
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="domain_reg_portal">Domain Registry Customer Portal</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Domain Registry Customer Portal" type="text" class="form-control form-control-sm" id="domain_reg_portal" name="domain_reg_portal" v-model="domainRegPortal" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="domain_reg_email">Registered Username / Email / ID</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter Registered Username / E-mail / ID" type="text" class="form-control form-control-sm" id="domain_reg_email" name="domain_reg_email" v-model="domainRegEmail" />
                  </div>
                </div>
                <div class="form-group row">
                  <label class="col-md-6 text-right pr-3 mt-1" for="domain_reg_pass">Password</label>
                  <div class="col-md-6 input-group">
                    <input placeholder="Enter Password" type="password" class="form-control form-control-sm" id="domain_reg_pass" name="domain_reg_pass" v-model="domainRegPassword" />
                  </div>
                </div>
                <div class="row">
                  <div class="controls col-md-12" style="text-align: center;">
                    <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order py-2 px-3" id="button-id-signup" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h4 class="card-title text-red py-2"><i class="fas fa-lightbulb">&nbsp;</i>Important Notes</h4>
            <div class="card-tools float-right">
              <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <ol class="list-group">
            <li class="list-group-item">Filling out this form will open a new ticket for our support department to begin your migration.</li>
            <li class="list-group-item">Please be as complete and accurate as possible to avoid any delays.</li>
            <li class="list-group-item">A typical migration is completed within 48 to 72 hours. Sometimes longer if the amount of data to copy is large.</li>
            <li class="list-group-item">The old hosting account needs to be online and accessible while we performing the migration, else we may face difficulty.</li>
            <li class="list-group-item">Please do not make any update on your site while we perform the migration, else those data may not be copied to the new hosting.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
