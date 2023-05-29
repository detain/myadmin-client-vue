<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  setup() {
    const id = ref(''); // Assign the value of `$id` here
    const csrf_token = ref(''); // Assign the value of `$csrf_token` here
    const domain = ref(''); // Assign the value of `$domain` here

    onMounted(() => {
      Swal.fire({
        type: 'error',
        title: '<h3>Buy Additional IP</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Order',
        html: `
          <p>Your domain <span class="text-2lg">${domain.value}</span> already has Whois Privacy addon</p>
          <p>Are you sure want to disable & cancel it?</p>
        `,
        preConfirm: () => {
          document.getElementById('buyIpDisableForm').submit();
        },
      });
    });

    return {
      id,
      csrf_token,
      domain,
    };
  },
};
</script>

<template>
  <form
    id="buyIpDisableForm"
    :action="`view_vps?id=${id}&link=buy_ip`"
    method="POST"
  >
    <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token">
  </form>
</template>

<style scoped>
</style>

