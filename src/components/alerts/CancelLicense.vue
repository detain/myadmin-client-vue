<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
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
    </form>
</template>

<style scoped></style>
