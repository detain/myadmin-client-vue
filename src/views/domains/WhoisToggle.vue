<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { useSiteStore } from '@/stores/site.store';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const props = defineProps<{
    id: number;
    funct: string;
    domain: string;
}>();

const module = 'domains';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const router = useRouter();

onMounted(() => {
    const isDisable = props.funct === 'disableCancel';
    Swal.fire({
        icon: isDisable ? 'warning' : 'question',
        title: `<h3>${t('domains.whoisToggle.title')}</h3>`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: isDisable ? t('domains.whoisToggle.disableCancelConfirm') : t('domains.whoisToggle.enableConfirm'),
        confirmButtonColor: isDisable ? '#d33' : '#3085d6',
        html: `
      <p>${isDisable ? t('domains.whoisToggle.addonEnabled', { domain: props.domain }) : t('domains.whoisToggle.addonDisabled', { domain: props.domain })}</p>
      <p>${isDisable ? t('domains.whoisToggle.confirmDisable') : t('domains.whoisToggle.confirmEnable')}</p>
    `,
        preConfirm: () => {
            return fetchWrapper
                .post(`${baseUrl}/${moduleLink(module)}/${props.id}/whois`, { action: props.funct })
                .then((response) => {
                    return response;
                })
                .catch((error: any) => {
                    Swal.showValidationMessage(error?.text || error?.error || 'Request failed');
                });
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                html: result.value.text || (isDisable ? t('domains.whois.whoisDisabled') : t('domains.whois.whoisEnabled')),
            }).then(() => {
                router.push(`/${moduleLink(module)}/${props.id}`);
            });
        }
    });
});
</script>

<template>
    <div></div>
</template>

<style scoped></style>
