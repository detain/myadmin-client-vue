<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  setup() {
    const url = ref(''); // Assign the value of `$url` here
    const csrf_token = ref(''); // Assign the value of `$csrf_token` here
    const html = ref(''); // Assign the value of `$html` here

    onMounted(() => {
      Swal.fire({
        type: 'question',
        title: '<h3>Are you sure?</h3>',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes',
        html: html.value,
        preConfirm: () => {
          document.getElementById('confirmDialog').submit();
        },
      });
    });

    return {
      url,
      csrf_token,
      html,
    };
  },
};
</script>

<template>
  <form id="confirmDialog" :action="url" method="POST">
    <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token">
  </form>
</template>

<style scoped>
</style>

