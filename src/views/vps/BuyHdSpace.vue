<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSiteStore } from '@/stores/site.store';
import { VpsInfo } from '@/types/vps';
import { QsInfo } from '@/types/qs';
import Swal from 'sweetalert2';

const { t } = useI18n();

const props = defineProps<{
    currencySymbol: string;
    module: string;
    id: number;
    serviceInfo: VpsInfo | QsInfo;
}>();
const gbCost = ref(0.1);
const size = ref(0);
const router = useRouter();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const slider = ref<number>(size.value ?? 1);
const sizeLabel = computed<string>(() => `${slider.value} GB`);
const perTen = computed<string>(() => (gbCost.value * 10).toFixed(2));
const amount = computed<string>(() => (slider.value * gbCost.value).toFixed(2));
const id = computed(() => props.id);
const module = computed(() => props.module);

function submitForm() {
    let postData = {
        amount: slider.value,
    };
    fetchWrapper
        .post(`${baseUrl}/${moduleLink(module.value)}/${id.value}/buy_hd_space`, postData)
        .then((response: any) => {
            console.log('api success', response);
            Swal.fire({
                icon: 'success',
                html: response.text,
            });
            router.push(`/cart/${response.invoice}`);
        })
        .catch((error: any) => {
            console.log('api failed', error);
            Swal.fire({
                icon: 'error',
                html: t('vps.common.gotError', { error }),
            });
        });
}

async function loadData() {
    fetchWrapper
        .get(`${baseUrl}/${moduleLink(module.value)}/${id.value}/buy_hd_space`)
        .then((response: any) => {
            console.log('api success', response);
            gbCost.value = response.gbCost;
            size.value = response.size;
        })
        .catch((error: any) => {
            console.log('api failed', error);
            Swal.fire({
                icon: 'error',
                html: t('vps.common.gotError', { error }),
            });
        });
}

loadData();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-server"></i>&nbsp;{{ t('vps.buyHdSpace.title') }}</h3>
                        <div class="card-tools text-end">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-bs-toggle="tooltip" :title="t('vps.buyHdSpace.goBack')"><i class="fas fa-arrow-left"></i> {{ t('common.buttons.back') }}</router-link>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <form method="POST">
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">{{ t('vps.buyHdSpace.costPerMonth', { symbol: currencySymbol }) }}</label>
                                </div>
                                <div class="col-md-9">
                                    <input type="text" class="form-control form-control-sm" :value="amount" readonly />
                                    <span class="text-muted text-sm">{{ t('vps.buyHdSpace.perTenGb', { symbol: currencySymbol, cost: perTen }) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">{{ t('vps.buyHdSpace.additionalSpace') }}</label>
                                </div>
                                <div class="col-md-9">
                                    <input name="size" type="text" class="form-control form-control-sm" :value="sizeLabel" readonly />
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-3 p-0">
                                    <label class="col-form-label">{{ t('vps.buyHdSpace.selectSpace') }}</label>
                                </div>
                                <div class="col-md-9">
                                    <input v-model.number="slider" type="range" class="form-range form-control form-control-sm" min="1" max="100" step="1" name="slices" />
                                    <span class="text-muted text-sm">{{ t('vps.buyHdSpace.spaceNote') }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row justify-content-center">
                            <div class="controls">
                                <button type="submit" class="btn btn-sm btn-order px-3 py-2" @click.prevent="submitForm">{{ t('vps.buyHdSpace.confirmOrder') }}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
