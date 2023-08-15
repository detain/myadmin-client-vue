<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
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
</script>

<template>
    <form id="cancelForm" :action="`view_domain?id=${id}&link=cancel`" method="POST">
    </form>
</template>

<style scoped></style>
