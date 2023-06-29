<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
const id = ref(''); // Assign the value of `$id` here
const csrf_token = ref(''); // Assign the value of `$csrf_token` here
const hostname = ref(''); // Assign the value of `$hostname` here
const addons = ref([]); // Assign the value of `$addons` here

onMounted(() => {
    Swal.fire({
        type: 'error',
        title: '<h3>Cancel Rapid Deploy Server Service</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
      <p>Are you sure want to cancel your Rapid Deploy Server <span class="text-2lg">${hostname.value}</span>${addons.value.length ? ' and its addons' : ''}?</p>
    `,
        preConfirm: () => {
            document.getElementById('cancelForm').submit();
        },
    });
});
</script>

<template>
    <form id="cancelForm" :action="`view_qs?id=${id}&link=cancel`" method="POST">
        <input id="csrf_token" type="hidden" name="csrf_token" :value="csrf_token" />
    </form>
</template>

<style scoped></style>
