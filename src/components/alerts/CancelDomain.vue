<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  setup() {
    const id = ref(''); // Assign the value of `$id` here
    const csrf_token = ref(''); // Assign the value of `$csrf_token` here
    const domain = ref(''); // Assign the value of `$domain` here
    const addons = ref([]); // Assign the value of `$addons` here

    onMounted(() => {
      Swal.fire({
        type: 'error',
        title: '<h3>Cancel Domain Service</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
          <p>Are you sure want to cancel your domain <span class="text-2lg">${domain.value}</span>${addons.value.length ? ` and its addon <span class="text-2lg">Whois Privacy</span>` : ''}?</p>
        `,
        preConfirm: () => {
          document.getElementById('cancelForm').submit();
        },
      });
    });

    return {
      id,
      csrf_token,
      domain,
      addons,
    };
  },
};
</script>

<template>
  <form id="cancelForm" :action="`view_domain?id=${id}&link=cancel`" method="POST">
    <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token">
  </form>
</template>

<style scoped>
</style>

