<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const id = ref(''); // Assign the value of `$id` here
const order_id = ref(''); // Assign the value of `$order_id` here

onMounted(() => {
    Swal.fire({
        icon: 'error',
        title: '<h3>Cancel SSL</h3> ',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Cancel it.',
        html: `
      <p>Are you sure want to cancel your ssl <span class="text-2lg">${order_id.value}</span>?</p>
    `,
        preConfirm: () => {
            ((document.getElementById('cancelForm') as unknown) as HTMLFormElement).submit();
        },
    });
});
</script>

<template>
    <form id="cancelForm" :action="`view_ssl?id=${id}&link=cancel`" method="POST">
    </form>
</template>

<style scoped></style>
