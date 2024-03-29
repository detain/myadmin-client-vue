<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper.ts';

import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store.ts';

import Swal from 'sweetalert2';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const dnssec_records = ref([]);
//const id = ref('{$id}');
const domainId = ref('{$domain_id}');

const confirmDialog = () => {
    Swal.fire({
        title: 'Are you sure want to remove all DNSSEC records?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove them!',
    }).then((result) => {
        if (result.value) {
            (document.getElementById('removethem') as unknown as HTMLFormElement).submit();
        }
    });
};

const showAddDnsContent = () => {
    const obj = document.getElementById('add-dns-content') as HTMLElement;
    obj.style.display = 'block';
};

const checkCharacterLimit = (event: Event, limit: number, displayId: string) => {
    if ((event.target as unknown as HTMLInputElement).value.length > limit) {
        event.preventDefault();
    }
    const obj = document.getElementById(displayId) as HTMLElement;
    obj.innerHTML = `Characters left: <b>${limit - (event.target as unknown as HTMLInputElement).value.length}</b>`;
};

function showAddDNSContent() {}

function hideAddDNSContent() {}

function saveDNSSEC() {}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header border-0">
                    <router-link :to="'/domains/' + props.id" style="float: right" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
                    <h3 class="card-title ml-2 mt-1"><i class="fas fa-lock">&nbsp;</i>DNSSEC Infomation</h3>
                    <div class="card-tools m-0">
                        <a id="add-new" class="btn btn-custom px-3 py-2 text-sm" href="javascript:void(0);" @click="showAddDNSContent"><i class="fa fa-plus-circle">&nbsp;</i>Add New Record</a>
                        <template v-if="dnssec_records && dnssec_records.length">
                            <form id="removethem" method="POST" :action="'view_domain?id=' + props.id + '&link=dnssec'" class="d-inline">
                                <input type="hidden" name="action" value="delete" />
                                <button type="submit" class="btn btn-sm bg-gradient-red text-white" @click.prevent="confirmDialog"><i class="fa fa-times-circle">&nbsp;</i>Remove All DNSSEC Records</button>
                            </form>
                        </template>
                    </div>
                </div>
                <div class="card-body row justify-content-center">
                    <template v-if="dnssec_records && dnssec_records.length">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Digest Type</th>
                                    <th>Algorithm</th>
                                    <th>Key Tag</th>
                                    <th>Digest</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(dnssec, key) in dnssec_records" :key="key">
                                    <td>{{ dnssec['Digest Type'] }}</td>
                                    <td>{{ dnssec['Algorithm'] }}</td>
                                    <td>{{ dnssec['Key Tag'] }}</td>
                                    <td>{{ dnssec['Digest'] }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-else>
                        <h5 class="text-orange w-100 tex-red b-radius text-bold py-2 text-center">No DNSSEC Records found.</h5>
                    </template>

                    <div class="card form-gray col-md-10 mt-5" id="add-dns-content" v-show="showAddDNSContent">
                        <div class="card-header p-3">
                            <h3 class="card-title text-bold text-center text-xl" style="width: 95%">Add DNSSEC</h3>
                            <div class="card-tools m-0 pt-2">
                                <button type="button" class="btn btn-tool" data-card-widget="remove" @click="hideAddDNSContent"><i class="fas fa-times"></i></button>
                            </div>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="saveDNSSEC" method="post" :action="'view_domain?id=' + props.id + '&link=dnssec'">
                                <input type="hidden" name="action" value="add" />
                                <div v-for="foo in 3" :key="foo">
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label" :for="'name' + (foo + 1)">Digest Type #{{ foo + 1 }}</label>
                                        <div class="col-md-10 input-group">
                                            <select :name="'digest_type[' + foo + ']'" class="form-control select2" style="width: 100%" required>
                                                <option value="">Select</option>
                                                <option value="1">SHA-1</option>
                                                <option value="2" :selected="foo === 0">SHA-256</option>
                                                <option value="3">GOST</option>
                                                <option value="4">SHA-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-2 col-form-label" :for="'name' + (foo + 1)">Algorithm #{{ foo + 1 }}</label>
                                        <div class="col-sm-10 input-group">
                                            <select :name="'algorithm[' + foo + ']'" class="form-control select2" style="width: 100%" required>
                                                <option value="">Select</option>
                                                <option value="2">Diffie-Hellman</option>
                                                <option value="3">DSA/SHA-1</option>
                                                <option value="5">RSA/SHA-1</option>
                                                <option value="6">DSA-NSEC3/SHA1</option>
                                                <option value="7">RSASHA1-NSEC3/SHA1</option>
                                                <option value="8" :selected="foo === 0">RSA/SHA-256</option>
                                                <option value="10">RSA/SHA-512</option>
                                                <option value="13">ECDSA Curve P-256 with SHA-256</option>
                                                <option value="14">ECDSA Curve P-384 with SHA-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-2 col-form-label" :for="'name' + (foo + 1)">Key Tag #{{ foo + 1 }}</label>
                                        <div class="col-sm-10 input-group">
                                            <input type="number" :placeholder="'Enter Key Tag ( Example: 2371 )'" :name="'key_tag[' + foo + ']'" class="form-control text-sm" required />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-2 col-form-label" :for="'name' + (foo + 1)">Digest #{{ foo + 1 }}</label>
                                        <div class="col-sm-10 input-group">
                                            <textarea :placeholder="'Enter Value of Digest #' + (foo + 1) + ' ( Must not be greater than: ' + (foo === 0 ? '40' : foo === 1 ? '64' : '96') + ' Characters )'" :id="'digest' + (foo + 1)" class="form-control text-sm" :name="'digest[' + foo + ']'" rows="5" required></textarea>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-sm-12">
                                            <div class="text-muted text-right" :id="'display' + (foo + 1)">
                                                Characters left: <b>{{ foo === 0 ? '40' : foo === 1 ? '64' : '96' }}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2 col-form-label" for="submit"></label>
                                    <div class="col-sm-10 input-group input-group-sm">
                                        <input type="submit" name="Submit" value="Save" class="btn btn-custom px-4 pt-2" id="button-id-signup" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
