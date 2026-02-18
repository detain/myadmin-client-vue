<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import { moduleLink } from '@/helpers/moduleLink.ts';
const props = defineProps<{
    id: number;
}>();
const module = 'domains';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const showForm = ref(false);
const dnssecRecords = ref<ExistingDNSSEC[]>([]);
const records = ref<DNSSECRecord[]>([
    { digestType: '2', algorithm: '8', keyTag: null, digest: '', maxLength: 40, visible: true, importText: '' },
    { digestType: '', algorithm: '', keyTag: null, digest: '', maxLength: 64, visible: false, importText: '' },
    { digestType: '', algorithm: '', keyTag: null, digest: '', maxLength: 96, visible: false, importText: '' },
]);

interface DNSSECRecord {
    digestType: string;
    algorithm: string;
    keyTag: number | null;
    digest: string;
    maxLength: number;
    visible: boolean;
    importText?: string;
}

interface ExistingDNSSEC {
    digestType: string;
    algorithm: string;
    keyTag: number;
    digest: string;
}

function importDsRecord(record: DNSSECRecord) {
    if (!record.importText) return;
    /**
     * Expected format:
     * <domain> IN DS <keyTag> <algorithm> <digestType> <digest> ; comment
     */
    const regex = /\sDS\s+(\d+)\s+(\d+)\s+(\d+)\s+([a-fA-F0-9]+)/;
    const match = record.importText.match(regex);
    if (!match) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid DS Record',
            text: 'Unable to parse DS record format.',
        });
        return;
    }
    record.keyTag = Number(match[1]);
    record.algorithm = match[2];
    record.digestType = match[3];
    record.digest = match[4];
    record.importText = '';
}

function confirmRemoveAll() {
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove them!',
    }).then((result) => {
        if (result.isConfirmed) {
            // submit delete action here
        }
    });
}

function submitForm() {
    const payload = records.value.filter((r) => r.visible);
    console.log(payload);
    // submit payload to backend
}

function loadDnsSec() {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    try {
        fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/dnssec`).then((response) => {
            Swal.close();
            console.log('domain dns sec', response);
            dnssecRecords.value = response.records;
        });
    } catch (error: any) {
        Swal.close();
        console.log('domain dns sec', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

loadDnsSec();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header border-0">
                    <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" style="float: inline-start" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
                    <h3 class="card-title mt-1 ml-2"><i class="fas fa-lock"></i>&nbsp;DNSSEC Information</h3>
                    <div class="card-tools m-0">
                        <button class="btn btn-custom py-2 text-sm px-3" @click="showForm = true"><i class="fa fa-plus-circle"></i>&nbsp;Add New Record</button>
                        <button v-if="dnssecRecords.length" class="btn btn-sm bg-gradient-red text-white ml-2" @click="confirmRemoveAll"><i class="fa fa-times-circle"></i>&nbsp;Remove All DNSSEC Records</button>
                    </div>
                </div>
                <div class="card-body row justify-content-center">
                    <table v-if="dnssecRecords.length" class="table">
                        <thead>
                            <tr>
                                <th>Digest Type</th>
                                <th>Algorithm</th>
                                <th>Key Tag</th>
                                <th>Digest</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(dnssec, i) in dnssecRecords" :key="i">
                                <td>{{ dnssec.digestType }}</td>
                                <td>{{ dnssec.algorithm }}</td>
                                <td>{{ dnssec.keyTag }}</td>
                                <td>{{ dnssec.digest }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h5 v-else class="text-orange text-center w-100 py-2 text-bold">No DNSSEC Records found.</h5>
                    <!-- ADD DNSSEC -->
                    <div v-if="showForm" class="card form-gray col-md-10 mt-5">
                        <div class="card-header p-3">
                            <h3 class="card-title text-xl text-bold text-center">Add DNSSEC</h3>
                            <div class="card-tools pt-2 m-0">
                                <button class="btn btn-tool" @click="showForm = false">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="submitForm">
                                <div v-for="(record, index) in records" v-show="record.visible" :key="index">
                                    <!-- IMPORT DS RECORD -->
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label">Import DS</label>
                                        <div class="col-md-8">
                                            <input v-model="record.importText" type="text" class="form-control" placeholder="host.com. IN DS 1172 13 1 26ffc7 ; ( SHA1 digest )" />
                                        </div>
                                        <div class="col-md-2">
                                            <button type="button" class="btn btn-primary w-100" @click="importDsRecord(record)">Import</button>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> Digest Type #{{ index + 1 }} </label>
                                        <div class="col-md-10">
                                            <select v-model="record.digestType" class="form-control" :required="index === 0">
                                                <option value="">Select</option>
                                                <option value="1">SHA-1</option>
                                                <option value="2">SHA-256</option>
                                                <option value="3">GOST</option>
                                                <option value="4">SHA-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> Algorithm #{{ index + 1 }} </label>
                                        <div class="col-md-10">
                                            <select v-model="record.algorithm" class="form-control" :required="index === 0">
                                                <option value="">Select</option>
                                                <option value="8">RSA/SHA-256</option>
                                                <option value="13">ECDSA P-256</option>
                                                <option value="14">ECDSA P-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> Key Tag #{{ index + 1 }} </label>
                                        <div class="col-md-10">
                                            <input v-model.number="record.keyTag" type="number" class="form-control" placeholder="Enter Key Tag (Example: 2371)" :required="index === 0" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> Digest #{{ index + 1 }} </label>
                                        <div class="col-md-10">
                                            <textarea v-model="record.digest" class="form-control" rows="5" placeholder="Enter Value of Digest (Must not be greater than 40 Characters)" :maxlength="record.maxLength" :required="index === 0"></textarea>
                                            <div class="text-right text-muted">
                                                Characters left: <b>{{ record.maxLength - record.digest.length }}</b>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="index < 2" class="text-right mb-3">
                                        <button type="button" class="btn btn-sm btn-primary" @click="records[index + 1].visible = true"><i class="fa fa-plus"></i>&nbsp;Add More</button>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-custom pt-2 px-4" type="submit">Save</button>
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
