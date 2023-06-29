<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
const csrf_token = ref(''); // Assign the value of `$csrf_token` here
const ip = ref(''); // Assign the value of `$ip` here

onMounted(() => {
    Swal.fire({
        type: 'error',
        title: '<h3>Cancel License</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
      <p>Are you sure want to cancel your license <span class="text-2lg">${ip.value}</span>?</p>
    `,
        preConfirm: () => {
            document.getElementById('cancelForm').submit();
        },
    });
});
</script>

<template>
    <form id="cancelForm" :action="`view_license?id=${id}&link=cancel`" method="POST">
        <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token" />
    </form>
</template>

<style scoped></style>
