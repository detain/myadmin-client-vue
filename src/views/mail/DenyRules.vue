<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
//import { number } from 'yup';
import { moduleLink } from '../../helpers/moduleLink.ts';
const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);
const module = 'mail';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const spam = ref<SpamRow[]>([]);
const collapsed = ref(false);
const showModal = ref(false);
const form = ref({
    action: 'add',
    rule_id: '',
    type: '',
    data: '',
});
const typeOptions = [
    { value: 'domain', label: 'Sender Domain', example: 'example: google.com' },
    { value: 'email', label: 'Sender Email', example: 'example: noreply@domain.com' },
    { value: 'startswith', label: 'Sender Email Starts With', example: 'example: msgid-' },
    { value: 'destination', label: 'Destination Email', example: 'example: noreply@domain.com' },
];
const modalTitle = computed(() => (form.value.action === 'edit' ? 'Update Block' : 'Add New Block'));

type RuleType = 'domain' | 'email' | 'startswith' | 'destination';

interface SpamRow {
    id: number;
    user: string;
    type: RuleType;
    data: string;
    created: string;
}

function getTypeLabel(type: RuleType) {
    const match = typeOptions.find((option) => option.value === type);
    return match ? match.label : type;
}

function deleteRule(ruleId: number) {
    if (confirm('Are you sure you want to delete this rule?')) {
        fetchWrapper
            .delete(`${baseUrl}/${moduleLink(module)}/${id.value}/rules/${ruleId}`)
            .then(() => {
                console.log('api success');
                loadRules();
            })
            .catch((error: any) => {
                console.log('api failed');
                console.log(error);
            });
    }
}

function openAdd() {
    form.value = {
        action: 'add',
        rule_id: '',
        type: '',
        data: '',
    };
    showModal.value = true;
}

function openEdit(email: SpamRow) {
    form.value = {
        action: 'edit',
        rule_id: email.id as unknown as string,
        type: email.type,
        data: email.data,
    };
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
}
async function submitForm() {
    try {
        if (form.value.action == 'add') {
            const response = await fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${id.value}/rules`, {
                type: form.value.type,
                data: form.value.data,
            });
            console.log('api success');
            console.log(response);
        } else {
            const response = await fetchWrapper.put(`${baseUrl}/${moduleLink(module)}/${id.value}/rules/${form.value.rule_id}`, {
                type: form.value.type,
                data: form.value.data,
            });
            console.log('api success');
            console.log(response);
        }
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
    await loadRules();
    closeModal();
}

const loadRules = async () => {
    try {
        const response: SpamRow[] = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/rules`);
        console.log('api success');
        console.log(response);
        spam.value = response;
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadRules();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><i class="fa fa-mail-bulk"></i> Mail Deny Rules</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-custom" @click="openAdd"><i class="fa fa-plus"></i> Add New</button>
                        <button type="button" class="btn btn-tool" @click="collapsed = !collapsed">
                            <i class="fas" :class="collapsed ? 'fa-plus' : 'fa-minus'"></i>
                        </button>
                    </div>
                </div>
                <div v-if="!collapsed" class="card-body">
                    <table v-if="spam.length" class="table table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Created</th>
                                <th>Type</th>
                                <th>Data</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="email in spam" :key="email.id">
                                <td>
                                    <a :href="`index.php?choice=none.mailinfo&id=${email.id}`" title="View Mail Details">{{ email.id }}</a>
                                </td>
                                <td class="truncate">{{ email.created }}</td>
                                <td class="truncate">{{ getTypeLabel(email.type) }}</td>
                                <td class="truncate">{{ email.data }}</td>
                                <td class="truncate">
                                    <button class="btn btn-sm btn-primary me-1" @click="openEdit(email)">Edit</button>
                                    <button class="btn btn-sm btn-primary" @click="deleteRule(email.id)"> Delete </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="callout callout-danger text-red text-sm"><i class="fa fa-bullhorn"></i> <strong>Heads up!</strong> No spam blocks added yet.</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-backdrop">
        <div class="modal fade show d-block">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header mx-4">
                        <h4 class="modal-title">{{ modalTitle }}</h4>
                        <button type="button" class="btn-close" @click="closeModal">X</button>
                    </div>
                    <div class="modal-body mx-4">
                        <form id="block-form" method="post" @submit.prevent="submitForm">
                            <!-- Type -->
                            <div class="form-group row mx-auto">
                                <label class="col-md-2 col-form-label px-0"> Type <span class="text-danger">*</span> </label>
                                <div class="col-sm-8">
                                    <div v-for="option in typeOptions" :key="option.value" class="icheck-success d-inline me-3">
                                        <input :id="option.value" v-model="form.type" class="form-check-input" type="radio" name="type" :value="option.value" />
                                        <label :for="option.value" class="more-info">
                                            <span class="fw-semibold ps-2">{{ option.label }}</span> - <span class="text-muted">{{ option.example }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <!-- Data -->
                            <div class="form-group row">
                                <label class="col-sm-2 col-form-label px-0"> Data <span class="text-danger">*</span> </label>
                                <div class="col-md-8">
                                    <input v-model="form.data" type="text" class="form-control form-control-sm" name="data" required />
                                </div>
                            </div>
                            <!-- Actions -->
                            <div class="form-group row">
                                <div class="controls col-md-12 text-center">
                                    <input type="submit" value="Submit" class="btn btn-sm btn-order py-2 px-3" />
                                    <button type="button" class="btn btn-danger btn-sm py-2 px-3" @click="closeModal">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.truncate {
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1240;
}
</style>
