<script setup lang="ts">
import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useSiteStore } from '@/stores';
const siteStore = useSiteStore();
siteStore.setPageHeading('Change Username');
siteStore.setTitle('Change Username');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Change Username'],
]);
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-7">Username changes have been temporarily disabled.</div>
    </div>
</template>
