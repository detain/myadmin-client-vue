<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import { moduleLink } from '@/helpers/moduleLink.ts';

const { t } = useI18n();
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
            title: t('domains.dnssec.invalidDsRecord'),
            text: t('domains.dnssec.unableToParse'),
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
        title: t('common.confirm.title'),
        text: t('domains.dnssec.confirmRemoveAll'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('domains.dnssec.yesRemoveThem'),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.dnssec.removingRecords')}`,
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            fetchWrapper
                .delete(`${baseUrl}/${moduleLink(module)}/${id.value}/dnssec`)
                .then((response) => {
                    Swal.fire({
                        icon: 'success',
                        title: t('domains.dnssec.removed'),
                        text: typeof response === 'string' ? response : t('domains.dnssec.removeSuccess'),
                    });
                    dnssecRecords.value = [];
                })
                .catch((error: any) => {
                    Swal.fire({
                        icon: 'error',
                        title: t('common.confirm.title'),
                        html: error?.text || error?.error || 'Failed to remove DNSSEC records.',
                    });
                });
        }
    });
}

function submitForm() {
    const payload = records.value.filter((r) => r.visible && r.algorithm && r.digestType && r.digest);
    if (payload.length === 0) {
        Swal.fire({ icon: 'warning', title: t('domains.dnssec.noRecords'), text: t('domains.dnssec.noRecordsWarning') });
        return;
    }
    const algorithm: string[] = [];
    const digest_type: string[] = [];
    const key_tag: (number | null)[] = [];
    const digest: string[] = [];
    payload.forEach((r) => {
        algorithm.push(r.algorithm);
        digest_type.push(r.digestType);
        key_tag.push(r.keyTag);
        digest.push(r.digest);
    });
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.dnssec.savingRecords')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module)}/${id.value}/dnssec`, { algorithm, digest_type, key_tag, digest })
        .then((response) => {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: typeof response === 'string' ? response : t('domains.dnssec.saveSuccess'),
            });
            showForm.value = false;
            loadDnsSec();
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: error?.text || error?.error || 'Failed to save DNSSEC records.',
            });
        });
}

function loadDnsSec() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.contact.pleaseWait')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${id.value}/dnssec`)
        .then((response) => {
            Swal.close();
            dnssecRecords.value = response.records || [];
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load DNSSEC records.',
            });
        });
}

loadDnsSec();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header border-0">
                    <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" style="float: inline-start" data-toggle="tooltip" :title="t('domains.order.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm" />&nbsp;{{ t('common.buttons.back') }}</router-link>
                    <h3 class="card-title mt-1 ml-2"><font-awesome-icon :icon="['fas', 'lock']" />&nbsp;{{ t('domains.dnssec.title') }}</h3>
                    <div class="card-tools m-0">
                        <button class="btn btn-custom py-2 text-sm px-3" @click="showForm = true"><font-awesome-icon :icon="['fas', 'plus-circle']" />&nbsp;{{ t('domains.dnssec.addNewRecord') }}</button>
                        <button v-if="dnssecRecords.length" class="btn btn-sm bg-gradient-red text-white ml-2" @click="confirmRemoveAll"><font-awesome-icon :icon="['far', 'times-circle']" />&nbsp;{{ t('domains.dnssec.removeAllRecords') }}</button>
                    </div>
                </div>
                <div class="card-body row justify-content-center">
                    <table v-if="dnssecRecords.length" class="table">
                        <thead>
                            <tr>
                                <th>{{ t('domains.dnssec.digestTypeHeader') }}</th>
                                <th>{{ t('domains.dnssec.algorithmHeader') }}</th>
                                <th>{{ t('domains.dnssec.keyTagHeader') }}</th>
                                <th>{{ t('domains.dnssec.digestHeader') }}</th>
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
                    <h5 v-else class="text-orange text-center w-100 py-2 text-bold">{{ t('domains.dnssec.noRecords') }}</h5>
                    <!-- ADD DNSSEC -->
                    <div v-if="showForm" class="card form-gray col-md-10 mt-5">
                        <div class="card-header p-3">
                            <h3 class="card-title text-xl text-bold text-center">{{ t('domains.dnssec.addDnssec') }}</h3>
                            <div class="card-tools pt-2 m-0">
                                <button class="btn btn-tool" @click="showForm = false">
                                    <font-awesome-icon :icon="['fas', 'times']" />
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="submitForm">
                                <div v-for="(record, index) in records" v-show="record.visible" :key="index">
                                    <!-- IMPORT DS RECORD -->
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label">{{ t('domains.dnssec.importDs') }}</label>
                                        <div class="col-md-8">
                                            <input v-model="record.importText" type="text" class="form-control" :placeholder="t('domains.dnssec.importPlaceholder')" />
                                        </div>
                                        <div class="col-md-2">
                                            <button type="button" class="btn btn-primary w-100" @click="importDsRecord(record)">{{ t('domains.dnssec.import') }}</button>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> {{ t('domains.dnssec.digestType', { number: index + 1 }) }} </label>
                                        <div class="col-md-10">
                                            <select v-model="record.digestType" class="form-control" :required="index === 0">
                                                <option value="">{{ t('domains.dnssec.select') }}</option>
                                                <option value="1">SHA-1</option>
                                                <option value="2">SHA-256</option>
                                                <option value="3">GOST</option>
                                                <option value="4">SHA-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> {{ t('domains.dnssec.algorithm', { number: index + 1 }) }} </label>
                                        <div class="col-md-10">
                                            <select v-model="record.algorithm" class="form-control" :required="index === 0">
                                                <option value="">{{ t('domains.dnssec.select') }}</option>
                                                <option value="8">RSA/SHA-256</option>
                                                <option value="13">ECDSA P-256</option>
                                                <option value="14">ECDSA P-384</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> {{ t('domains.dnssec.keyTag', { number: index + 1 }) }} </label>
                                        <div class="col-md-10">
                                            <input v-model.number="record.keyTag" type="number" class="form-control" :placeholder="t('domains.dnssec.enterKeyTag')" :required="index === 0" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label"> {{ t('domains.dnssec.digest', { number: index + 1 }) }} </label>
                                        <div class="col-md-10">
                                            <textarea v-model="record.digest" class="form-control" rows="5" :placeholder="t('domains.dnssec.enterDigest', { max: record.maxLength })" :maxlength="record.maxLength" :required="index === 0"></textarea>
                                            <div class="text-right text-muted">
                                                {{ t('domains.dnssec.charactersLeft', { count: record.maxLength - record.digest.length }) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="index < 2" class="text-right mb-3">
                                        <button type="button" class="btn btn-sm btn-primary" @click="records[index + 1].visible = true"><font-awesome-icon :icon="['fas', 'plus']" />&nbsp;{{ t('domains.dnssec.addMore') }}</button>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-custom pt-2 px-4" type="submit">{{ t('common.buttons.save') }}</button>
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
