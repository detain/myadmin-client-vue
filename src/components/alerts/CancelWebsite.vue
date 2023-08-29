<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
const hostname = ref(''); // Assign the value of `$hostname` here
const addons = ref([]); // Assign the value of `$addons` here

onMounted(() => {
    Swal.fire({
        icon: 'error',
        title: '<h3>Cancel Website Service</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
      <p>Are you sure want to cancel your website <span class="text-2lg">${hostname.value}</span>${addons.value.length ? ' and its addons' : ''}?</p>
    `,
        preConfirm: () => {
            document.getElementById('cancelForm')?.submit();
        },
    });
});
</script>

<template>
    <form id="cancelForm" :action="`view_website?id=${id}&link=cancel`" method="POST">
    </form>
</template>

<style scoped></style>
