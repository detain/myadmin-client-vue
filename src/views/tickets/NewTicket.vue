<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTicketsStore } from '../../stores/tickets.store';
import { reactive, ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
const ticketsStore = useTicketsStore();
const route = useRoute();
console.log('Route Query View:');
console.log(route.query.view);
//const { tickets, loading, error, ima, custid, sortcol, sortdir, countArray, inboxCount, viewText, rowsOffset, rowsTotal, limit, currentPage, pages, view, search } = storeToRefs(ticketsStore);
//ticketsStore.getAll();
const createAs = ref('customer');
const message = ref('');
const departments = {};
const products = {};
const subject = ref('');
const kyDept = ref('');
const ima = ref('admin');
const abuse = '';

const handleFile = (e: Event) => {
    const input = e.target as HTMLInputElement;
    file.value = input.files?.[0] || null;
};

const handleSubmit = () => {
    const payload = new FormData();

    Object.entries(form).forEach(([k, v]) => payload.append(k, String(v)));

    if (file.value) payload.append('file', file.value);

    // Replace with fetchWrapper / axios
    console.log('Submitting ticket', payload);
};

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
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-9">
            <form class="new-ticket needs-validation" novalidate autocomplete="off" @submit.prevent="handleSubmit">
                <div class="card">
                    <!-- Header -->
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h3 class="card-title pt-2"><i class="fa fa-ticket"></i>&nbsp;New Ticket</h3>
                        <button type="button" class="btn bg-teal btn-sm bg-gradient-gray" @click="showTerms = true">Terms of use</button>
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
                                <input v-model="form.subject" type="text" class="form-control form-control-sm" required />
                                <div class="invalid-feedback">Please enter short description about issue.</div>
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="form-group row">
                            <label class="col-sm-3 col-form-label">Description</label>
                            <div class="col-sm-9">
                                <textarea v-model="form.content" class="form-control form-control-sm" rows="10" required />
                                <div class="invalid-feedback">Please enter detailed description about issue.</div>
                            </div>
                        </div>

                        <!-- File Upload -->
                        <div class="form-group row mb-0">
                            <label class="col-sm-3 col-form-label">File Upload</label>
                            <div class="col-sm-9 input-group">
                                <input type="file" class="form-control form-control-sm" accept="image/png,image/jpeg,image/gif" @change="handleFile" />
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
                                <span class="help-text text-red d-block"> <b>Please note:</b> By opening a support request InterServer may need to access your server. </span>
                            </div>
                        </div>

                        <!-- Root / IP -->
                        <div v-if="form.allowAccess" class="form-row">
                            <div class="form-group col-md-4 offset-md-3">
                                <label>Root Password</label>
                                <input v-model="form.rootPassword" class="form-control form-control-sm" />
                            </div>

                            <div class="form-group col-md-5">
                                <label>Your IP Address</label>
                                <input v-model="form.clientIp" class="form-control form-control-sm" />
                            </div>
                        </div>

                        <!-- SSH Restricted -->
                        <div v-if="form.allowAccess" class="form-group row">
                            <label class="col-sm-3 col-form-label"> Is SSH root restricted? </label>
                            <div class="col-sm-9 my-auto">
                                <label class="mr-3">
                                    <input v-model="form.sshRestricted" type="radio" value="1" />
                                    Yes
                                </label>
                                <label>
                                    <input v-model="form.sshRestricted" type="radio" value="0" />
                                    No
                                </label>
                            </div>
                        </div>

                        <!-- SSH Fields -->
                        <div v-if="form.allowAccess && form.sshRestricted === '1'" class="form-row">
                            <div class="form-group col-md-4 offset-md-3">
                                <label>Sudo User</label>
                                <input v-model="form.sudoUser" class="form-control form-control-sm" />
                            </div>

                            <div class="form-group col-md-4">
                                <label>Sudo Password</label>
                                <input v-model="form.sudoPassword" class="form-control form-control-sm" />
                            </div>

                            <div class="form-group col-md-1">
                                <label>SSH Port</label>
                                <input v-model.number="form.sshPort" type="number" class="form-control form-control-sm" />
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
                    <slot name="terms" />
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
