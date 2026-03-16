<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const id = ref(''); // Assign the value of `$id` here

onMounted(() => {
    Swal.fire({
        icon: 'question',
        title: `<h3>${t('domains.eppCode.title')}</h3>`,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: t('domains.eppCode.confirmButton'),
        html: `<p>${t('domains.eppCode.confirmMessage')}</p>`,
        preConfirm: () => {
            (document.getElementById('eppcodeForm') as unknown as HTMLFormElement).submit();
        },
    });
});
</script>

<template>
    <form id="eppcodeForm" :action="`view_domain?id=${id}`" method="POST">
        <input type="hidden" name="link" value="eppcode" />
    </form>
</template>

<style scoped></style>
