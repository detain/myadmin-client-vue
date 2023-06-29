<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
const csrf_token = ref(''); // Assign the value of `$csrf_token` here
const username = ref(''); // Assign the value of `$username` here

onMounted(() => {
    Swal.fire({
        type: 'error',
        title: '<h3>Cancel Mail</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
      <p>Are you sure want to cancel your mail <span class="text-2lg">${username.value}</span>?</p>
    `,
        preConfirm: () => {
            document.getElementById('cancelForm').submit();
        },
    });
});
</script>

<template>
    <form id="cancelForm" :action="`view_mail?id=${id}&link=cancel`" method="POST">
        <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token" />
    </form>
</template>

<style scoped></style>
