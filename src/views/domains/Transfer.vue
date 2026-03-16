<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import { moduleLink } from '@/helpers/moduleLink.ts';
import Swal from 'sweetalert2';
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
        html: '<i class="fas fa-spinner fa-pulse"></i> Loading transfer status...',
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
                    <h3 class="card-title text-lg"><i class="fas fa-exchange-alt">&nbsp;</i>Transfer Status</h3>
                    <div class="card-tools m-0">
                        <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
                    </div>
                </div>
                <div class="card-body">
                    <template v-if="loadingDone && !isTransfer">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i>&nbsp; {{ errorMsg || 'This domain is not a transfer.' }}
                        </div>
                    </template>
                    <template v-else-if="loadingDone && isTransfer">
                        <table class="table table-bordered">
                            <tbody>
                                <tr v-if="transferInfo.status">
                                    <td class="font-weight-bold" style="width: 200px">Status</td>
                                    <td>{{ transferInfo.status }}</td>
                                </tr>
                                <tr v-if="transferInfo.statusText">
                                    <td class="font-weight-bold">Status Details</td>
                                    <td><em>{{ transferInfo.statusText }}</em></td>
                                </tr>
                                <tr v-if="transferInfo.transferrable">
                                    <td class="font-weight-bold">Transferrable</td>
                                    <td>{{ transferInfo.transferrable }}</td>
                                </tr>
                                <tr v-if="transferInfo.transferType">
                                    <td class="font-weight-bold">Transfer Type</td>
                                    <td>{{ transferInfo.transferType }}</td>
                                </tr>
                                <tr v-if="transferInfo.reason">
                                    <td class="font-weight-bold">Reason</td>
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
