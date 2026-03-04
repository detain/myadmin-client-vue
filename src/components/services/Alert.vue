<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

const url = ref(''); // Assign the value of `$url` here
const html = ref(''); // Assign the value of `$html` here
const display = ref('yes');
const action = ref('eppcode');
const actions = ref(['confirm']);

onMounted(() => {
    Swal.fire({
        icon: 'question',
        title: '<h3>Are you sure?</h3>',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes',
        html: html.value,
        preConfirm: () => {
            (document.getElementById('confirmDialog') as unknown as HTMLFormElement).submit();
        },
    });
});
</script>

<template>
    <div v-if="display == 'yes'">
        <template v-if="action == 'confirm'" />
    </div>
</template>

<style scoped></style>
