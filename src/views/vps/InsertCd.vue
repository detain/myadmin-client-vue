<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

const { t } = useI18n();

const props = defineProps<{
    id: number;
    module: string;
}>();
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const action = ref('');
const id = computed(() => props.id);
const module = computed(() => props.module);
const url = ref('');
const goBackLink = ref('');
const protocols = ref('https');
const links = ref(['https://templates.is.cc/knoppix/KNOPPIX_V9.1CD-2021-01-25-EN.iso', 'https://templates.is.cc/systemrescuecd/systemrescue-7.01-amd64.iso']);
function submitForm() {
    // Handle form submission
    try {
        let postData = {
            url: url.value,
        };
        fetchWrapper.post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/insert_cd`, postData).then((response: any) => {
            console.log('api success', response);
            Swal.fire({
                icon: 'success',
                html: response.message,
            });
        });
    } catch (error: any) {
        console.log('api failed', error);
        Swal.fire({
            icon: 'error',
            html: t('vps.common.gotError', { error: error.message }),
        });
    }
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2">
                            <i class="fas fa-compact-disc"></i>&nbsp;
                            {{ action === 'enable_cd' ? t('vps.insertCd.enableCdrom') : t('vps.insertCd.insertIso') }}
                        </h3>
                        <div class="card-tools text-end">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('vps.common.goBack')"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;{{ t('common.buttons.back') }}&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <input type="hidden" name="link" value="insert_cd" />
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="slices" class="col-form-label">{{ t('vps.insertCd.allowedProtocols') }}</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" readonly :value="protocols" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="col-md-3">
                                <label for="image" class="col-form-label">{{ t('vps.insertCd.chooseImage') }}</label>
                            </div>
                            <div class="col-sm-9 input-group">
                                <select id="image" name="image" class="form-control form-control-sm select2">
                                    <option v-for="(link, index) in links" :key="index" :value="link">{{ link }}</option>
                                </select>
                            </div>
                        </div>
                        <hr />
                        <h5 class="text-bold text-center text-sm">{{ t('vps.insertCd.or') }}</h5>
                        <hr />
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3">
                                    <label for="slices" class="col-form-label">{{ t('vps.insertCd.enterUrl') }}</label>
                                </div>
                                <div class="col-md-9">
                                    <input v-model="url" type="text" name="url" class="form-control form-control-sm" :placeholder="t('vps.insertCd.urlPlaceholder')" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <div class="input-group">
                                <div class="col-md-3">&nbsp;</div>
                                <div class="form-check col-md-9 text-bold mt-3 text-black">
                                    <input id="confirmation" type="checkbox" class="form-check-input" name="confirm" value="yes" required />
                                    <label class="form-check-label" for="confirmation">{{ t('vps.insertCd.areYouSure') }}</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="controls">
                                <button name="insert_cd" type="submit" class="btn btn-sm btn-order px-3 py-2">{{ t('vps.insertCd.continueButton') }}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
