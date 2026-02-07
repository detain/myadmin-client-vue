<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import { moduleLink } from '@/helpers/moduleLink';

const props = defineProps<{
    id: number;
}>();

/* ---------------- Core ---------------- */

const route = useRoute();
const router = useRouter();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'mail';

/* ---------------- Types ---------------- */

interface MailLogEmail {
    _id: number;
    id: number;
    user?: string;
    created: string;
    to: string;
    from: string;
    subject: string;
    origin: string;
    delivered: number | null;
    code: string | null;
    response: string | null;
}

interface MailLogResponse {
    total: number;
    skip: number;
    limit: number;
    emails: Record<string, MailLogEmail>;
}

/* ---------------- State ---------------- */

const loading = ref(false);
const total = ref(0);
const limit = ref(25);
const page = ref(Number(route.query.page ?? 1));
const emails = ref<MailLogEmail[]>([]);
const showOptions = ref(false);

/* ---------------- Search Model ---------------- */

const filters = ref({
    to: route.query.to ?? '',
    from: route.query.from ?? '',
    replyto: route.query.replyto ?? '',
    headerfrom: route.query.headerfrom ?? '',
    mailid: route.query.mailid ?? '',
    user: route.query.user ?? '',
    subject: route.query.subject ?? '',
    origin: route.query.origin ?? '',
    startDate: route.query.startDate ?? '',
    endDate: route.query.endDate ?? '',
    delivered: route.query.delivered ?? '',
});

/* ---------------- Computed ---------------- */

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

/* ---------------- Helpers ---------------- */

const deliveredLabel = (val: number | null) => {
    if (val === null) return 'New';
    if (val === 0) return 'Failed';
    if (val === 1) return 'Success';
    if (val === 2) return 'Deferred';
    return val;
};

const buildQuery = () => ({
    ...filters.value,
    page: page.value,
});

function buildQueryString(): string {
    const params = new URLSearchParams();

    params.set('page', page.value.toString());
    params.set('limit', limit.value.toString());

    if (filters.value.to) params.set('to', filters.value.to);
    if (filters.value.from) params.set('from', filters.value.from);
    if (filters.value.subject) params.set('subject', filters.value.subject);
    if (filters.value.origin) params.set('origin', filters.value.origin);
    if (filters.value.delivered !== '') params.set('delivered', filters.value.delivered);

    if (filters.value.startDate) params.set('startDate', filters.value.startDate);
    if (filters.value.endDate) params.set('endDate', filters.value.endDate);

    return params.toString();
}

/* ---------------- API ---------------- */

const loadLog = async () => {
    loading.value = true;

    const query = buildQueryString();

    const response = await fetchWrapper.get<MailLogResponse>(`${baseUrl}/${moduleLink(module)}/${props.id}/log?${query}`);

    total.value = response.total;
    limit.value = response.limit;
    emails.value = Object.values(response.emails);

    loading.value = false;
};

/* ---------------- Actions ---------------- */

const submitSearch = () => {
    page.value = 1;
    router.push({ query: buildQuery() });
};

const resetSearch = () => {
    Object.keys(filters.value).forEach((k) => (filters.value[k as keyof typeof filters.value] = ''));
    submitSearch();
};

const goToPage = (p: number) => {
    page.value = p;
    router.push({ query: buildQuery() });
};

/* ---------------- Watchers ---------------- */

watch(
    () => route.query,
    () => {
        page.value = Number(route.query.page ?? 1);
        loadLog();
    },
    { immediate: true }
);
</script>

<template>
    <div class="container-fluid">
        <h3>
            Log Search
            <button class="btn btn-primary btn-sm" type="button" @click="showOptions = !showOptions">Options</button>
        </h3>

        <!-- SEARCH -->
        <div v-show="showOptions" class="card bg-light card-body mb-3 mt-2">
            <form @submit.prevent="submitSearch">
                <input type="hidden" name="id" :value="id" />

                <!-- To / From -->
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">To</label>
                    <div class="col-sm-4">
                        <input v-model="filters.to" class="form-control" />
                    </div>

                    <label class="col-sm-2 col-form-label">From</label>
                    <div class="col-sm-4">
                        <input v-model="filters.from" class="form-control" />
                    </div>
                </div>

                <!-- Subject / Origin -->
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Subject</label>
                    <div class="col-sm-4">
                        <input v-model="filters.subject" class="form-control" />
                    </div>

                    <label class="col-sm-2 col-form-label">Origin</label>
                    <div class="col-sm-4">
                        <input v-model="filters.origin" class="form-control" />
                    </div>
                </div>

                <!-- Date Range -->
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Start</label>
                    <div class="col-sm-4">
                        <input v-model="filters.startDate" class="form-control" />
                    </div>

                    <label class="col-sm-2 col-form-label">End</label>
                    <div class="col-sm-4">
                        <input v-model="filters.endDate" class="form-control" />
                    </div>
                </div>

                <!-- Delivered -->
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Delivered</label>
                    <div class="col-sm-4">
                        <select v-model="filters.delivered" class="form-control">
                            <option value="">Any</option>
                            <option value="1">Delivered</option>
                            <option value="0">Failed</option>
                        </select>
                    </div>
                </div>

                <!-- Buttons -->
                <div class="text-center">
                    <button class="btn btn-secondary mr-2" type="button" @click="resetSearch">Reset</button>
                    <button class="btn btn-primary" type="submit">Search</button>
                </div>
            </form>
        </div>

        <!-- TABLE -->
        <table class="table table-striped table-sm table-hover">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Time</th>
                    <th>To</th>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Origin</th>
                    <th>Delivered</th>
                    <th>Code</th>
                    <th>Response</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="email in emails" :key="email.id">
                    <td>
                        <RouterLink :to="`/mail/${id}/info/${email.id}`">
                            {{ email.id }}
                        </RouterLink>
                    </td>
                    <td>{{ email.created }}</td>
                    <td>{{ email.to }}</td>
                    <td>{{ email.from }}</td>
                    <td>{{ email.subject }}</td>
                    <td>{{ email.origin }}</td>
                    <td>{{ deliveredLabel(email.delivered) }}</td>
                    <td>{{ email.code }}</td>
                    <td>{{ email.response }}</td>
                </tr>

                <tr v-if="!emails.length && !loading">
                    <td colspan="9" class="text-center">No results</td>
                </tr>
            </tbody>
        </table>

        <!-- PAGINATION -->
        <nav class="d-flex justify-content-center">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: page === 1 }">
                    <a class="page-link" @click="goToPage(page - 1)">Prev</a>
                </li>

                <li v-for="p in totalPages" :key="p" class="page-item" :class="{ active: page === p }">
                    <a class="page-link" @click="goToPage(p)">
                        {{ p }}
                    </a>
                </li>

                <li class="page-item" :class="{ disabled: page === totalPages }">
                    <a class="page-link" @click="goToPage(page + 1)">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped></style>
