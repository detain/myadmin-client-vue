<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

//const id = ref('');
const spam = ref([]);
const blockAction = ref('');
const blockId = ref('');
const blockData = ref('');
const modalTitle = ref('');
const blockTypes = ref([
    {
        label: 'Sender Domain',
        value: 'domain',
        example: 'example: google.com',
    },
    {
        label: 'Sender Email',
        value: 'email',
        example: 'example: noreply@domain.com',
    },
    {
        label: 'Sender Email Starts With',
        value: 'startswith',
        example: 'example: msgid-',
    },
    {
        label: 'Destination Email',
        value: 'destination',
        example: 'example: noreply@domain.com',
    },
]);
function empty(value) {
    return value.length === 0;
}
function editBlock(action, id, type, data) {
    blockAction.value = action;
    blockId.value = id;
    blockData.value = data;
    modalTitle.value = action === 'edit' ? 'Update Block' : 'Add New Block';
    const typeInput = document.getElementById(type);
    if (typeInput) {
        typeInput.checked = true;
    }
}
function loadEmail(id) {
    // Implement the loadEmail functionality
}
function submitBlock() {
    // Implement the submitBlock functionality
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><i class="fa fa-mail-bulk"></i> Mail Deny Rules</h3>
                    <div class="card-tools">
                        <a href="javascript:void(0);" class="btn btn-custom" data-toggle="modal" data-target="#add-new" @click="editBlock('add', '0', 'domain', '')"> <i class="fa fa-plus"></i> Add New </a>
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body justify-content-center">
                    <template v-if="!empty(spam)">
                        <table class="table-sm table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Created</th>
                                    <th>Type</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="email in spam" :key="email.id">
                                    <td>
                                        <a :href="'index.php?choice=none.mailinfo&id=' + email.id" @click="loadEmail(email.id)">
                                            {{ email.id }}
                                        </a>
                                    </td>
                                    <td style="max-width: 300px; overflow: hidden; white-space: nowrap">
                                        {{ email.created }}
                                    </td>
                                    <td style="max-width: 300px; overflow: hidden; white-space: nowrap">
                                        {{ email.type_display }}
                                    </td>
                                    <td style="max-width: 300px; overflow: hidden; white-space: nowrap">
                                        {{ email.data }}
                                    </td>
                                    <td style="max-width: 300px; overflow: hidden; white-space: nowrap">
                                        <a href="javascript:void(0);" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#add-new" @click="editBlock('edit', email.id, email.type, email.data)"> Edit </a>
                                        <a :href="'view_mail?id=' + id + '&link=deny_rules&action=delete&rule_id=' + email.id" class="btn btn-sm btn-primary"> Delete </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <div v-else class="callout callout-danger text-red text-sm">
                        <i class="fa fa-bullhorn" aria-hidden="true">&nbsp;</i>
                        <strong>Heads up!&nbsp;</strong>No spam blocks added yet.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add New Popup -->
    <div class="modal fade" id="add-new" style="display: none" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 id="modal-title" class="modal-title">{{ modalTitle }}</h4>
                </div>
                <div class="modal-body mx-4">
                    <form id="block-form" @submit.prevent="submitBlock">
                        <input id="action" type="hidden" name="action" :value="blockAction" />
                        <input id="rule_id" type="hidden" name="rule_id" :value="blockId" />
                        <div class="form-group row mx-auto">
                            <label class="col-md-2 col-form-label px-0" for="mail_types"
                                >Type
                                <span class="text-danger">*</span>
                            </label>
                            <div class="col-sm-8 input-group">
                                <div v-for="blockType in blockTypes" :key="blockType.value" class="icheck-success d-inline">
                                    <input :id="blockType.value" type="radio" class="form-check-input" name="type" :value="blockType.value" />
                                    <label class="more-info" :for="blockType.value">
                                        <span style="padding-left: 10px; font-weight: 600">{{ blockType.label }}</span>
                                        - <span class="text-muted">{{ blockType.example }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-2 col-form-label px-0"
                                >Data
                                <span class="text-danger">*</span>
                            </label>
                            <div class="col-md-8">
                                <input id="data" type="text" class="form-control form-control-sm" name="data" required v-model="blockData" />
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="controls col-md-12" style="text-align: center">
                                <input type="submit" name="Submit" value="Submit" class="btn btn-sm btn-order px-3 py-2" />
                                <button type="button" class="btn btn-danger btn-sm px-3 py-2" data-dismiss="modal" aria-label="Close">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- End Add New Popup -->
</template>

<style scoped></style>
