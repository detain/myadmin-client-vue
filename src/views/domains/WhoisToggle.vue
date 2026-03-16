<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';

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
        title: '<h3>Whois Privacy Addon</h3>',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: isDisable ? 'Disable & Cancel it.' : 'Enable Whois',
        confirmButtonColor: isDisable ? '#d33' : '#3085d6',
        html: `
      <p>Your domain <span class="text-2lg"><b>${props.domain}</b></span> Whois Privacy addon is ${isDisable ? 'Enabled' : 'Disabled'}</p>
      <p>Are you sure you want to ${isDisable ? 'Disable & Cancel it' : 'Enable Whois'}?</p>
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
                html: result.value.text || (isDisable ? 'Whois Privacy has been disabled and canceled.' : 'Whois Privacy has been enabled.'),
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
