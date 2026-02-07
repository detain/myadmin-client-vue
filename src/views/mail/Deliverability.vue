<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import $ from 'jquery';
import { moduleLink } from '@/helpers/moduleLink.ts';
import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => props.id);
const module = 'mail';
const deliverabilityData = ref<DeliverabilityResponse>({
    id: 0,
    col1: '',
    header: '',
    percent: 0,
    stat: {
        bounced: 0,
        delivered: 0,
    },
    table_data: [],
});

interface DeliverabilityResponse {
    id: number;
    col1: string;
    header: string;
    percent: number;
    stat: {
        bounced: number;
        delivered: number;
    };
    table_data: [string, string, string, string][];
}

const loadDeliverability = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/deliverability`);
        console.log('api success');
        console.log(response);
        deliverabilityData.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadDeliverability();
</script>

<template>
    <div />
</template>

<style scoped></style>
