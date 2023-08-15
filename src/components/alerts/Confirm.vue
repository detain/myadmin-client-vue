<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const url = ref(''); // Assign the value of `$url` here
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
</script>

<template>
    <form id="confirmDialog" :action="url" method="POST">
    </form>
</template>

<style scoped></style>
