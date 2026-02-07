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
const delistData = ref<DelistResponse>({
    id: 0,
    local: [],
    mbtrap: [],
    subject: [],
    manual: [],
});

interface LocalRow {
    Date: string;
    SMTPFrom: string;
    MessageId: string;
    Subject: string;
    MimeRecipients: string;
}

interface SubjectRow {
    fromemail: string;
    headersubject: string;
}

interface ManualRow {
    date: string;
    fromemail: string;
    source: string;
}

interface DelistResponse {
    id: number;
    local: LocalRow[];
    mbtrap: LocalRow[];
    subject: SubjectRow[];
    manual: ManualRow[];
}

const loadDelist = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/delist`);
        console.log('api success');
        console.log(response);
        delistData.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadDelist();
</script>

<template>
    <div />
</template>

<style scoped></style>
