<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  setup() {
    const id = ref(''); // Assign the value of `$id` here
    const csrf_token = ref(''); // Assign the value of `$csrf_token` here
    const domain_lock_status = ref(''); // Assign the value of `$domain_lock_status` here

    onMounted(() => {
      Swal.fire({
        type: 'warning',
        title: '<h3>Domain Lock/Unlock</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: `Yes, ${domain_lock_status.value === 'Active' ? 'Unlock' : 'Lock'} it.`,
        html: `
          <p>Your domain lock is <span class="text-2lg">${domain_lock_status.value}</span>.</p>
          <p>Do you want to <span class="text-2lg">${domain_lock_status.value === 'Active' ? 'Inactivate' : 'Activate'}</span> domain lock?</p>
        `,
        preConfirm: () => {
          document.getElementById('lockForm').submit();
        },
      });
    });

    return {
      id,
      csrf_token,
      domain_lock_status,
    };
  },
};
</script>

<template>
  <form id="lockForm" :action="`view_domain?id=${id}&link=lock`" method="POST">
    <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token">
    <input id="status" type="hidden" name="status" :value="domain_lock_status === 'Active' ? '0' : '1'">
  </form>
</template>

<style scoped>
</style>

