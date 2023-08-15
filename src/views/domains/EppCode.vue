<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here

onMounted(() => {
    Swal.fire({
        type: 'question',
        title: '<h3>Email EPP Code</h3>',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Send Me',
        html: '<p>Are you sure want to send <span class="text-2lg">EPP Code</span> to registered email ?</p>',
        preConfirm: () => {
            document.getElementById('eppcodeForm').submit();
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
