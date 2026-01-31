<script setup lang="ts">
import { useTicketsStore } from '../../stores/tickets.store';
import { useSiteStore } from '../../stores/site.store.ts';
import { reactive, ref, onMounted, computed, nextTick } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';
import Prism from 'prismjs';
const ticketsStore = useTicketsStore();
const siteStore = useSiteStore();
const route = useRoute();
console.log('Route Query View:');
console.log(route.query.view);
const products = ref({});
siteStore.setBreadcrums([
    ['/home', 'Home'],
    [`/tickets`, 'Tickets'],
    [`/tickets/new`, 'New Ticket'],
]);
siteStore.setPageHeading('New Ticket');
siteStore.setTitle('New Ticket');
const baseUrl = siteStore.getBaseUrl();

const handleFile = (e: Event) => {
    const input = e.target as HTMLInputElement;
    file.value = input.files?.[0] || null;
};

async function loadProducts() {
    products.value = await fetchWrapper.get(`${baseUrl}/tickets/new`);
}

async function handleSubmit() {
    let formData = {
        product: form.product,
        asubject: form.subject,
        content: form.content,
        allowAccess: form.allowAccess,
        rootPassword: form.rootPassword,
        clientIp: form.clientIp,
        sshRestricted: form.sshRestricted,
        sudoUser: form.sudoUser,
        sudoPassword: form.sudoPassword,
        sshPort: form.sshPort,
        attachments: [file.value],
    };
    console.log('Submitting ticket', formData);
    await Swal.fire({
        html: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });
    try {
        const res = await fetchWrapper.post(`${baseUrl}/tickets/new`, formData);
        Swal.close();
        if (res.status === 'success') {
            await Swal.fire('Reply Posted', res.message, 'success');
        } else {
            await Swal.fire('Warning', res.message, 'warning');
        }
    } catch {
        Swal.close();
        await Swal.fire('Error', 'Failed to post reply', 'error');
    }
}

const showTerms = ref(false);
const file = ref<File | null>(null);

const form = reactive({
    product: '',
    subject: '',
    content: '',
    allowAccess: true,
    rootPassword: '',
    clientIp: '',
    sshRestricted: '0',
    sudoUser: '',
    sudoPassword: '',
    sshPort: 22,
});

function bs_input_file(): void {
    document.querySelectorAll<HTMLElement>('.input-file').forEach((wrapper) => {
        // Prevent duplicate ghost inputs
        const next = wrapper.nextElementSibling;
        if (next && next.classList.contains('input-ghost')) {
            return;
        }
        // Create hidden file input
        const ghost = document.createElement('input');
        ghost.type = 'file';
        ghost.className = 'input-ghost';
        ghost.style.visibility = 'hidden';
        ghost.style.height = '0';
        // Copy name attribute
        const name = wrapper.getAttribute('name');
        if (name) ghost.name = name;
        wrapper.parentNode?.insertBefore(ghost, wrapper.nextSibling);
        // Type-safe element lookups
        const chooseBtn = wrapper.querySelector<HTMLButtonElement>('.btn-choose');
        const resetBtn = wrapper.querySelector<HTMLButtonElement>('.btn-reset');
        const textInput = wrapper.querySelector<HTMLInputElement>('input[type="text"]');
        // File selected → update text field
        ghost.addEventListener('change', () => {
            const fileName = ghost.value.split('\\').pop() || '';
            if (textInput) {
                textInput.value = fileName;
            }
        });
        // Choose button opens dialog
        chooseBtn?.addEventListener('click', () => {
            ghost.click();
        });
        // Reset clears everything
        resetBtn?.addEventListener('click', () => {
            ghost.value = '';
            if (textInput) {
                textInput.value = '';
            }
        });
        // Text input behavior
        if (textInput) {
            textInput.style.cursor = 'pointer';
            textInput.addEventListener('mousedown', (e: MouseEvent) => {
                e.preventDefault();
                ghost.click();
            });
        }
    });
}

onMounted(() => {
    loadProducts()
    bs_input_file();
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-9">
            <form class="new-ticket needs-validation" novalidate autocomplete="off" @submit.prevent="handleSubmit">
                <div class="card">
                    <!-- Header -->
                    <div class="card-header justify-content-between align-items-center">
                        <h3 class="card-title pt-2"><i class="fa fa-ticket"></i>&nbsp;New Ticket</h3>
                        <div class="card-tools">
                            <button type="button" class="btn bg-teal btn-sm bg-gradient-gray" @click="showTerms = true">Terms of use</button>
                        </div>
                    </div>
                    <!-- Body -->
                    <div class="card-body">
                        <!-- Product -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Product</label>
                            <div class="col-sm-9">
                                <select v-model="form.product" class="form-control form-control-sm">
                                    <option value="">Select Product</option>
                                    <optgroup v-for="(group, label) in products" :key="label" :label="label">
                                        <option v-for="(prodLabel, value) in group" :key="value" :value="value">
                                            {{ prodLabel }}
                                        </option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <!-- Subject -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Subject</label>
                            <div class="col-sm-9">
                                <input v-model="form.subject" type="text" class="form-control form-control-sm" placeholder="Subject" required />
                                <div class="invalid-feedback">Please enter short description about issue.</div>
                            </div>
                        </div>
                        <!-- Description -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Description</label>
                            <div class="col-sm-9">
                                <textarea v-model="form.content" class="form-control form-control-sm" placeholder="Thank you for helping us maintain a streamlined support system by submitting one request per ticket." rows="10" required />
                                <div class="invalid-feedback">Please enter detailed description about issue.</div>
                            </div>
                        </div>

                        <!-- File Upload -->
                        <div class="form-group row mb-0">
                            <label for="file_upload" class="col-sm-3 col-form-label requiredField">File Upload</label>
                            <div class="controls col-sm-9 input-group input-file" name="file_attachment">
                                <span class="input-group-btn"><button class="btn btn-secondary btn-sm btn-choose" type="button">Choose</button></span>
                                <input type="text" name="file_attachment" class="form-control form-control-sm input-text-file" placeholder="Choose a file..." />
                                <!-- <input type="file" class="form-control form-control-sm input-text-file" accept="image/png,image/jpeg,image/gif" @change="handleFile" /> -->
                                <span class="input-group-btn"><button class="btn btn-warning btn-reset btn-sm" type="button">Reset</button></span>
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-sm-9 offset-sm-3">
                                <span class="help-text text-gray"> Note: Only image files - gif/jpeg/png types are allowed. </span>
                            </div>
                        </div>
                        <hr />
                        <!-- Server Access -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Server Access</label>
                            <div class="col-sm-9">
                                <div class="icheck-success">
                                    <input v-model="form.allowAccess" type="checkbox" />
                                    <label> I allow InterServer to access my server and perform modifications </label>
                                </div>
                                <span class="help-text text-red d-block"><b>Please note:</b> By opening a support request InterServer may need to access, debug, or modify files in your account. This requirement is needed in order to provide technical support. Please only continue if you agree.</span>
                            </div>
                        </div>
                        <!-- Root / IP -->
                        <div v-if="form.allowAccess" class="form-row">
                            <div class="form-group col-md-4 offset-md-3">
                                <label>Root Password</label>
                                <input v-model="form.rootPassword" class="form-control form-control-sm" placeholder="VPS / Dedicated Server" />
                                <span class="help-text text-gray text-sm">Passwords are stored in a separate encrypted database.</span>
                                <div class="invalid-feedback">Server Root Password is required.</div>
                            </div>

                            <div class="form-group col-md-5">
                                <label>Your IP Address</label>
                                <input v-model="form.clientIp" class="form-control form-control-sm" placeholder="Your IP Address" />
                                <span class="help-text text-gray text-sm">If connection is coming from different IP address. Kindly change it.</span>
                            </div>
                        </div>
                        <!-- SSH Restricted -->
                        <div v-if="form.allowAccess" class="form-group row">
                            <label class="col-sm-3 col-form-label"> Is SSH root restricted? </label>
                            <div class="col-sm-9 my-auto">
                                <label class="mr-3"><input v-model="form.sshRestricted" type="radio" value="1" /> Yes</label>
                                <label><input v-model="form.sshRestricted" type="radio" value="0" /> No</label>
                            </div>
                        </div>
                        <!-- SSH Fields -->
                        <div v-if="form.allowAccess && form.sshRestricted === '1'" class="form-row">
                            <div class="form-group col-md-4 offset-md-3">
                                <label>Sudo User</label>
                                <input v-model="form.sudoUser" class="form-control form-control-sm" />
                                <div class="invalid-feedback">Sudo username is required.</div>
                            </div>

                            <div class="form-group col-md-4">
                                <label>Sudo Password</label>
                                <input v-model="form.sudoPassword" class="form-control form-control-sm" />
                                <div class="invalid-feedback">Sudo password is required.</div>
                            </div>
                            <div class="form-group col-md-1">
                                <label>SSH Port</label>
                                <input v-model.number="form.sshPort" type="number" class="form-control form-control-sm" />
                                <div class="invalid-feedback">Valid SSH Port number is required.</div>
                            </div>
                        </div>
                    </div>
                    <!-- Footer -->
                    <div class="card-footer text-center">
                        <button class="btn btn-custom" type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Terms Modal -->
    <div v-if="showTerms" class="modal-backdrop">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5>Terms of use</h5>
                    <button class="close" @click="showTerms = false">×</button>
                </div>
                <div class="modal-body p-4 mx-4">
                    <p>Before opening a ticket please ensure that your account or service has a recent backup. Some services like webhosting may receive complimentary backups if those sites fit into the backup policies. Backups are included for sites under 11GB in size and under 250,000 inodes. Sites over this amount will not be included in weekly backups. VPS services like KVM and openvz can take on demand backups in my.interserver.net - however there are no included automatic backups that run. InterServer may at its own discretion backup vps hostnodes however there is no guarantee of automatic backups. Dedicated servers will not auto backup unless backups have been configured previously. cPanel/WHM servers must enable automatic backups with in Webhost Manager under the backup section. By opening a ticket you are agreeing that you have local backups of the site in question, or waiving any need for a backup. In all cases, any changes requested with in the support ticket may be irreversible.</p>
                    <p>Dedicated servers and vps over 4 slices tickets receive Enterprise Support.</p>
                    <p>Webhosting packages and vps's under 4 slices receive Standard Support.</p>
                    <p>Non profit hosting, vps's on trial and user's receive Complimentary Support.</p>
                    <p>If your hosting was purchased through another company, such as a reseller, or are not the direct owner of the account all support must go through the company which you have purchased service from. InterServer only offers support to the account owner except as directed by the account owner.</p>
                    <p>If your hosting was purchased through another company, such as a reseller, or are not the direct owner of the account all support must go through the company which you have purchased service from. InterServer only offers support to the account owner except as directed by the account owner.</p>
                    <p>In order to receive support you must provide full details, such as error messages and the way to reproduce any error. If you fail to provide sufficient detail regarding the Incident InterServer support may not be able to assist in resolving the issues.</p>
                    <p>Support levels are handled in priority of: Enterprise support, standard support and Complimentary support.</p>
                    <p>Not all support requests fit with in InterServer's support offerings. If InterServer reaches determination that no resolution is feasible the ticket may be closed with out resolution. Possible reasons include development services out side of InterServer's knowledge, compromised sites with out backups or bugs with in the operating system being used with would be unreasonable for InterServer to offer support on. InterServer support techs are not developers for any operating system or software package that may be installed on systems. InterServer will make reasonable efforts to ensure services that come with your service to be running. This includes PHP and mysql on shared hosting; services provided by control panels such as cpanel, directadmin, plesk or breadbasket; ssh on a linux vps and remote desktop on windows. Services beyond this, especially ones installed after the service has been set up may not be eligible for support. Examples of ineligible services may include: postfix, powermta, tomcat except as provided with breadbasket, services that require old or outdated software such as end of life mysql, php or operating systems.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
