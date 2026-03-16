<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

const { t } = useI18n();
const id = ref(''); // Assign the value of `$id` here
const domain_lock_status = ref(''); // Assign the value of `$domain_lock_status` here

onMounted(() => {
    Swal.fire({
        icon: 'warning',
        title: `<h3>${t('domains.lock.title')}</h3> `,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: domain_lock_status.value === 'Active' ? t('domains.lock.unlockIt') : t('domains.lock.lockIt'),
        html: `
      <p>${t('domains.lock.statusActive', { status: domain_lock_status.value })}</p>
      <p>${domain_lock_status.value === 'Active' ? t('domains.lock.inactivateLock') : t('domains.lock.activateLock')}</p>
    `,
        preConfirm: () => {
            (document.getElementById('lockForm') as unknown as HTMLFormElement).submit();
        },
    });
});
</script>

<template>
    <form id="lockForm" :action="`view_domain?id=${id}&link=lock`" method="POST">
        <input id="status" type="hidden" name="status" :value="domain_lock_status === 'Active' ? '0' : '1'" />
    </form>
</template>

<style scoped></style>
