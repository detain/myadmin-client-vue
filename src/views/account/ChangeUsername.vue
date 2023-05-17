<script setup>
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia';
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useAuthStore, useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
layoutStore.setPageHeading('Change Username');
layoutStore.setTitle('Change Username');
layoutStore.setBreadcrums({'/home': 'Home', '': 'Change Username'});


</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-7">
        Username changes have been temporarily disabled.
    </div>
</div>
</template>
