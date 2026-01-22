<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import Swal from 'sweetalert2';

const props = defineProps<{
    id: number;
}>();
const module: string = 'webhosting';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
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
    try {
        fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${id.value}/migration`, {
            custPortal: custPortal.value,
            regEmail: regEmail.value,
            password: password.value,
            ctrlPanel: ctrlPanel.value,
            ftpUsername: ftpUsername.value,
            ftpPassword: ftpPassword.value,
            siteBusyMig: siteBusyMig.value,
            splReqMig: splReqMig.value,
            domainReg: domainReg.value,
            dataMig: dataMig.value,
            domainRegPortal: domainRegPortal.value,
            domainRegEmail: domainRegEmail.value,
            domainRegPassword: domainRegPassword.value,
        }).then((response) => {
            Swal.close();
            console.log('migration success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: `Success${response.text}`,
            });
        });
    } catch (error: any) {
        Swal.close();
        console.log('migration failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error}`,
        });
    }
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
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body pb-0">
                    <form @submit.prevent="submitForm">
                        <div class="card mb-0 shadow-none">
                            <div class="card-header">
                                <div class="p-1">
                                    <h3 class="card-title text-bold"><i aria-hidden="true" class="fa fa-info-circle">&nbsp;</i>Current Web Host Info</h3>
                                </div>
                            </div>
                            <div class="card-body pb-0">
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="cust_portal">Customer Portal URL</label>
                                    <div class="col-md-6">
                                        <input id="cust_portal" v-model="custPortal" placeholder="Enter Customer Portal URL" type="text" class="form-control form-control-sm" />
                                        <small class="form-text text-muted">For Example: sso.godaddy.com</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pl-0 pr-3 text-right" for="reg_email">Registered Username / Email / ID</label>
                                    <div class="col-md-6 input-group">
                                        <input id="reg_email" v-model="regEmail" placeholder="Enter Registered Username / E-mail / ID" type="text" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="pass">Password</label>
                                    <div class="col-md-6 input-group">
                                        <input id="pass" v-model="password" placeholder="Enter Password" type="password" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="ctrl_panel">Control Panel URL</label>
                                    <div class="col-md-6">
                                        <input id="ctrl_panel" v-model="ctrlPanel" placeholder="Enter Control Panel URL" type="text" class="form-control form-control-sm" />
                                        <small class="form-text text-muted">For Example: yourdomain.com/cpanel</small>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="ftp_usrname">FTP / Control Panel Username</label>
                                    <div class="col-md-6 input-group">
                                        <input id="ftp_usrname" v-model="ftpUsername" placeholder="Enter FTP / Control Panel Username" type="text" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="ftp_pass">FTP / Control Panel Password</label>
                                    <div class="col-md-6 input-group">
                                        <input id="ftp_pass" v-model="ftpPassword" placeholder="Enter FTP / Control Panel Password" type="password" class="form-control form-control-sm" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="site_busy_mig">If the site is live/busy site having high traffic, can we set a holding page during migration?</label>
                                    <div class="col-md-6 input-group">
                                        <select v-model="siteBusyMig" name="site_busy_mig" class="form-control form-control-sm">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="spl_req_mig">Does this site have special requirements like PHP Version / Modules?</label>
                                    <div class="col-md-6 input-group">
                                        <select v-model="splReqMig" name="spl_req_mig" class="form-control form-control-sm">
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
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="domain_reg">Do you also want us to help you transfer the domain name registration?</label>
                                    <div class="col-md-6 input-group">
                                        <select v-model="domainReg" name="domain_reg" class="form-control form-control-sm">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="data_mig">Do you want us to update the name servers as soon as we finish the data migration?</label>
                                    <div class="col-md-6 input-group">
                                        <select v-model="dataMig" name="data_mig" class="form-control form-control-sm">
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="domain_reg_portal">Domain Registry Customer Portal</label>
                                    <div class="col-md-6 input-group">
                                        <input id="domain_reg_portal" v-model="domainRegPortal" placeholder="Domain Registry Customer Portal" type="text" class="form-control form-control-sm" name="domain_reg_portal" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="domain_reg_email">Registered Username / Email / ID</label>
                                    <div class="col-md-6 input-group">
                                        <input id="domain_reg_email" v-model="domainRegEmail" placeholder="Enter Registered Username / E-mail / ID" type="text" class="form-control form-control-sm" name="domain_reg_email" />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-6 mt-1 pr-3 text-right" for="domain_reg_pass">Password</label>
                                    <div class="col-md-6 input-group">
                                        <input id="domain_reg_pass" v-model="domainRegPassword" placeholder="Enter Password" type="password" class="form-control form-control-sm" name="domain_reg_pass" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="controls col-md-12" style="text-align: center">
                                        <input id="button-id-signup" type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
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

<style scoped></style>
