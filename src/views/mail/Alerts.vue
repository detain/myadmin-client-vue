<script setup lang="ts">
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores';
import $ from 'jquery';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const alerts = ref([]);
const types_sel = ref({});
//const id = ref('');
const csrfToken = ref('');
const defaultTo = ref('');
const action = ref('');
const alertId = ref('');
const selectedType = ref('');
const value = ref('');
const to = ref('');
const enabled = ref(false);
const modalTitle = computed(() => {
    return action.value === 'edit' ? 'Update Alert/Notification Trigger' : 'Add New Alert/Notification Trigger';
});
const isEmpty = computed(() => {
    return alerts.value.length === 0;
});
function editAlert(formAct, formId, formType, formValue, formTo, formEnabled = false) {
    action.value = formAct;
    alertId.value = formId;
    selectedType.value = formType;
    value.value = formValue;
    to.value = formTo;
    enabled.value = formEnabled == true;

    $('#type').select2().trigger('change');
}
function submitBlock() {
    // Handle form submission here
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><i class="fa fa-bell"></i> Alerts</h3>
                    <div class="card-tools">
                        <a href="javascript:void(0);" class="btn btn-custom" data-toggle="modal" data-target="#add-new" @click="editAlert('add', '', '', '', defaultTo, '')"> <i class="fa fa-plus"></i> Add New </a>
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body justify-content-center">
                    <template v-if="!isEmpty(alerts)">
                        <table class="table-sm table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>To</th>
                                    <th>Enabled</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th>Links</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="alert in alerts" :key="alert.alert_id">
                                    <td>{{ alert.alert_id }}</td>
                                    <td>{{ alert.alert_type }}</td>
                                    <td>{{ alert.alert_value }}</td>
                                    <td>{{ alert.alert_to }}</td>
                                    <td>{{ alert.alert_enabled ? 'Yes' : 'No' }}</td>
                                    <td>{{ alert.alert_created }}</td>
                                    <td>{{ alert.alert_updated }}</td>
                                    <td style="max-width: 300px; overflow: hidden; white-space: nowrap">
                                        <a href="javascript:void(0);" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#add-new" @click="editAlert('edit', alert.alert_id, alert.alert_type, alert.alert_value, alert.alert_to, alert.alert_enabled)"> Edit </a>
                                        <a :href="'view_mail?id=' + id + '&link=alerts&action=delete&alert_id=' + alert.alert_id + '&csrf_token=' + csrfToken" class="btn btn-sm btn-primary"> Delete </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                    <template v-else>
                        <div class="callout callout-danger text-red text-sm">
                            <i class="fa fa-bullhorn" aria-hidden="true">&nbsp;</i>
                            <strong>Heads up!&nbsp;</strong>No alerts added yet.
                        </div>
                    </template>
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
                    <form @submit.prevent="submitBlock" id="block-form">
                        <input type="hidden" name="csrf_token" :value="csrfToken" />
                        <input id="action" type="hidden" name="action" :value="action" />
                        <input id="alert_id" type="hidden" name="alert_id" v-model="alertId" />
                        <div class="form-group row mx-auto">
                            <label class="col-md-4 col-form-label px-0" for="notification_types"> Notification Type <span class="text-danger">*</span> </label>
                            <div class="col-sm-8">
                                <select id="type" name="type" class="select2 w-100" v-model="selectedType">
                                    <option value="">Select notifications / alerts type</option>
                                    <option v-for="(label, type_id) in types_sel" :value="type_id" :key="type_id">{{ label }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Amount hits this value <span class="text-danger">*</span></label>
                            <div class="col-md-8">
                                <input id="value" type="text" class="form-control form-control-sm" name="value" v-model="value" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Where to send the notification to <span class="text-danger">*</span></label>
                            <div class="col-md-8">
                                <input id="to" type="text" class="form-control form-control-sm" name="to" v-model="to" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Enable Alert</label>
                            <div class="col-md-8">
                                <div class="icheck-success d-inline">
                                    <input id="enabled" type="checkbox" name="enabled" v-model="enabled" />
                                    <label for="enabled"> </label>
                                </div>
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
