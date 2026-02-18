<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores/site.store';
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
const alerts = ref<AlertRow[]>([]);
const types_sel = ref({});
const defaultTo = ref('');
const action = ref('');
const alertId = ref(0);
const selectedType = ref('');
const value = ref('');
const to = ref('');
const enabled = ref(false);
const modalTitle = computed(() => action.value === 'edit' ? 'Update Alert/Notification Trigger' : 'Add New Alert/Notification Trigger');
const isEmpty = computed(() => alerts.value.length === 0);
function editAlert(formAct: string, formId: number, formType: string, formValue: string, formTo: string, formEnabled: number | boolean = false) {
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

interface AlertRow {
    alert_id: number;
    alert_module: string;
    alert_service: number;
    alert_enabled: number;
    alert_type: string;
    alert_value: string;
    alert_notifier: string;
    alert_to: string;
    alert_created: string;
    alert_updated: string;
    alert_used: string;
}

function submitNameservers() {
    try {
        fetchWrapper.put(`${baseUrl}/${moduleLink(module)}/${id.value}/alerts`, {}).then((response) => {
            Swal.close();
            console.log('update alert success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: `Success${response.text}`,
            });
        });
    } catch (error: any) {
        Swal.close();
        console.log('update alert failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function registerAlert() {
    try {
        fetchWrapper.post(`${baseUrl}/${moduleLink(module)}/${id.value}/alerts`, {}).then((response) => {
            Swal.close();
            console.log('register alert success');
            console.log(response);
            Swal.fire({
                icon: 'success',
                html: `Success${response}`,
            });
        });
    } catch (error: any) {
        Swal.close();
        console.log('register alert failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error}`,
        });
    }
}

function confirmDelete(index: number) {
    Swal.fire({
        icon: 'error',
        title: 'Delete Alert',
        html: `<p>You are about to delete this alert.</p><br><p>Are you sure?</p>`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                fetchWrapper.delete(`${baseUrl}/${moduleLink(module)}/${id.value}/alerts?index=${index}`).then((response) => {
                    Swal.close();
                    console.log('delete alert success');
                    console.log(response);
                    Swal.fire({
                        icon: 'success',
                        html: `Success${response}`,
                    });
                });
            } catch (error: any) {
                Swal.close();
                console.log('delete alert failed');
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    html: `Got error ${error}`,
                });
            }
        }
    });
}

const loadAlerts = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/alerts`);
        console.log('api success');
        console.log(response);
    } catch (error: any) {
        console.log('api failed');
        console.log(error);
    }
};

loadAlerts();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title text-lg"><i class="fa fa-bell"></i> Alerts</h3>
                    <div class="card-tools">
                        <a href="javascript:void(0);" class="btn btn-custom" data-toggle="modal" data-target="#add-new" @click="editAlert('add', 0, '', '', defaultTo)"> <i class="fa fa-plus"></i> Add New </a>
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="remove">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body justify-content-center">
                    <template v-if="alerts.length > 0">
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
                                        <a :href="'view_mail?id=' + id + '&link=alerts&action=delete&alert_id=' + alert.alert_id" class="btn btn-sm btn-primary"> Delete </a>
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
    <div id="add-new" class="modal fade" style="display: none" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header mx-4">
                    <h4 id="modal-title" class="modal-title">{{ modalTitle }}</h4>
                </div>
                <div class="modal-body mx-4">
                    <form id="block-form" @submit.prevent="submitBlock">
                        <input id="action" type="hidden" name="action" :value="action" />
                        <input id="alert_id" v-model="alertId" type="hidden" name="alert_id" />
                        <div class="form-group row mx-auto">
                            <label class="col-md-4 col-form-label px-0" for="notification_types"> Notification Type <span class="text-danger">*</span> </label>
                            <div class="col-sm-8">
                                <select id="type" v-model="selectedType" name="type" class="select2 w-100">
                                    <option value="">Select notifications / alerts type</option>
                                    <option v-for="(label, type_id) in types_sel" :key="type_id" :value="type_id">{{ label }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Amount hits this value <span class="text-danger">*</span></label>
                            <div class="col-md-8">
                                <input id="value" v-model="value" type="text" class="form-control form-control-sm" name="value" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Where to send the notification to <span class="text-danger">*</span></label>
                            <div class="col-md-8">
                                <input id="to" v-model="to" type="text" class="form-control form-control-sm" name="to" required />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-sm-4 col-form-label px-0">Enable Alert</label>
                            <div class="col-md-8">
                                <div class="icheck-success d-inline">
                                    <input id="enabled" v-model="enabled" type="checkbox" name="enabled" />
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
