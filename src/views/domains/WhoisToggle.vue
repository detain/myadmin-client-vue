<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
const funct = ref(''); // Assign the value of `$funct` here
const domain = ref(''); // Assign the value of `$domain` here

onMounted(() => {
    Swal.fire({
        type: 'error',
        title: '<h3>Whois Privacy Addon</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: `${funct.value === 'disableCancel' ? 'Disable & Cancel it.' : 'Enable Whois'}`,
        html: `
      <p>Your domain <span class="text-2lg">${domain.value}</span> Whois Privacy addon is ${funct.value === 'disableCancel' ? 'Enabled' : 'Disabled'}</p>
      <p>Are you sure want to ${funct.value === 'disableCancel' ? 'Disable & Cancel it.' : 'Enable Whois'} it?</p>
    `,
        preConfirm: () => {
            document.getElementById('whoisDisableForm').submit();
        },
    });
});
</script>

<template>
    <form id="whoisDisableForm" :action="`view_domain?id=${id}&link=whois`" method="POST">
        <input id="func" type="hidden" name="func" :value="funct" />
        <input id="link" type="hidden" name="link" value="whois" />
    </form>
</template>

<style scoped></style>
