<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
import { moduleLink } from '@/helpers/moduleLink';

const props = defineProps<{
    id: number;
}>();

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'mail';

const delistData = ref<DelistResponse>({
    id: 0,
    local: [],
    mbtrap: [],
    subject: [],
    manual: [],
});

const unblockEmail = ref('');

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

/* -----------------------------
   Pagination helpers
----------------------------- */
const pageSize = 10;
const localPage = ref(1);
const mbtrapPage = ref(1);

const paged = <T,>(rows: T[], page: number) => rows.slice((page - 1) * pageSize, page * pageSize);

/* -----------------------------
   API calls
----------------------------- */
const loadDelist = async () => {
    try {
        delistData.value = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${props.id}/delist`);
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to load delist data', 'error');
    }
};

const submitUnblock = async (email: string) => {
    if (!email) return;

    try {
        await fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${props.id}/delist`, { unblock: email });

        Swal.fire('Success', `${email} unblocked`, 'success');
        unblockEmail.value = '';
        await loadDelist();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Unable to unblock email', 'error');
    }
};

onMounted(loadDelist);
</script>

<template>
    <div class="container">
        <h3 class="text-center">Delist Blocked Emails</h3>

        <!-- Unblock form -->
        <form class="row mb-3" @submit.prevent="submitUnblock(unblockEmail)">
            <label class="col-sm-3 col-form-label"> Unblock Email Address </label>
            <div class="col-sm-3">
                <input v-model="unblockEmail" class="form-control" type="email" placeholder="sender@domain.com" required />
            </div>
            <div class="col-sm-3">
                <button class="btn btn-secondary btn-sm"><i class="fa fa-plus"></i> Unblock</button>
            </div>
        </form>

        <!-- Local -->
        <h4 class="text-center">Locally Blocked Emails</h4>
        <table class="table table-striped table-bordered table-sm">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Email From</th>
                    <th>Message ID</th>
                    <th>Subject</th>
                    <th>Email To</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in paged(delistData.local, localPage)" :key="row.MessageId">
                    <td>{{ row.Date }}</td>
                    <td>
                        <a href="#" @click.prevent="submitUnblock(row.SMTPFrom)">
                            {{ row.SMTPFrom }}
                        </a>
                    </td>
                    <td>{{ row.MessageId }}</td>
                    <td>{{ row.Subject }}</td>
                    <td>{{ row.MimeRecipients }}</td>
                </tr>
            </tbody>
        </table>

        <!-- MailBaby Trap -->
        <h4 class="text-center">MailBaby Trap Blocked Emails</h4>
        <table class="table table-striped table-bordered table-sm">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Email From</th>
                    <th>Message ID</th>
                    <th>Subject</th>
                    <th>Email To</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in paged(delistData.mbtrap, mbtrapPage)" :key="row.MessageId">
                    <td>{{ row.Date }}</td>
                    <td>
                        <a href="#" @click.prevent="submitUnblock(row.SMTPFrom)">
                            {{ row.SMTPFrom }}
                        </a>
                    </td>
                    <td>{{ row.MessageId }}</td>
                    <td>{{ row.Subject }}</td>
                    <td>{{ row.MimeRecipients }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Subject -->
        <h4 class="text-center">Subject Blocked Emails</h4>
        <table class="table table-striped table-bordered table-sm">
            <thead>
                <tr>
                    <th>Email From</th>
                    <th>Subject</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in delistData.subject" :key="row.fromemail">
                    <td>
                        <a href="#" @click.prevent="submitUnblock(row.fromemail)">
                            {{ row.fromemail }}
                        </a>
                    </td>
                    <td>{{ row.headersubject }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>
