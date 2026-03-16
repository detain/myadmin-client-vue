<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { useI18n } from 'vue-i18n';
import { moduleLink } from '@/helpers/moduleLink.ts';
import Swal from 'sweetalert2';

const { t } = useI18n();
const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);
const module: string = 'domains';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const isTransfer = ref(false);
const transferInfo = ref<Record<string, string>>({});
const loadingDone = ref(false);
const errorMsg = ref('');

interface TransferResponse {
    transfer: boolean;
    message?: string;
    info?: Record<string, string>;
}

function loadTransfer() {
    Swal.fire({
        title: '',
        html: `<i class="fas fa-spinner fa-pulse"></i> ${t('domains.transfer.loadingTransferStatus')}`,
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module)}/${id.value}/transfer`)
        .then((response: TransferResponse) => {
            Swal.close();
            loadingDone.value = true;
            isTransfer.value = response.transfer;
            if (response.transfer && response.info) {
                transferInfo.value = response.info;
            } else if (!response.transfer && response.message) {
                errorMsg.value = response.message;
            }
        })
        .catch((error: any) => {
            Swal.fire({
                icon: 'error',
                html: error?.text || error?.error || 'Failed to load transfer status.',
            });
            loadingDone.value = true;
        });
}

loadTransfer();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><font-awesome-icon :icon="['fas', 'exchange-alt']" />&nbsp;{{ t('domains.transfer.title') }}</h3>
                    <div class="card-tools m-0">
                        <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" :title="t('domains.order.goBack')"><font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm" />&nbsp;{{ t('common.buttons.back') }}</router-link>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="loadingDone && !isTransfer">
                        <div class="alert alert-info">
                            <font-awesome-icon :icon="['fas', 'info-circle']" />&nbsp; {{ errorMsg || t('domains.transfer.notATransfer') }}
                        </div>
                    </template>
                    <template v-else-if="loadingDone && isTransfer">
                        <table class="table table-bordered">
                            <tbody>
                                <tr v-if="transferInfo.status">
                                    <td class="font-weight-bold" style="width: 200px">{{ t('domains.transfer.statusLabel') }}</td>
                                    <td>{{ transferInfo.status }}</td>
                                </tr>
                                <tr v-if="transferInfo.statusText">
                                    <td class="font-weight-bold">{{ t('domains.transfer.statusDetails') }}</td>
                                    <td><em>{{ transferInfo.statusText }}</em></td>
                                </tr>
                                <tr v-if="transferInfo.transferrable">
                                    <td class="font-weight-bold">{{ t('domains.transfer.transferrable') }}</td>
                                    <td>{{ transferInfo.transferrable }}</td>
                                </tr>
                                <tr v-if="transferInfo.transferType">
                                    <td class="font-weight-bold">{{ t('domains.transfer.transferType') }}</td>
                                    <td>{{ transferInfo.transferType }}</td>
                                </tr>
                                <tr v-if="transferInfo.reason">
                                    <td class="font-weight-bold">{{ t('domains.transfer.reason') }}</td>
                                    <td>{{ transferInfo.reason }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
