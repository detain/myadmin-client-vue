<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title"><i class="fas fa-shield-alt">&nbsp;</i>Firewall Rules</h3>
            <div class="card-tools">
                <button type="button" class="btn-custom text-sm mr-2" @click="showDialog">
                    <i class="fas fa-plus" aria-hidden="true">&nbsp;</i> Create New
                </button>
            </div>
        </div>
        <div class="card-body pt-5">
            <div v-if="firewallRules == undefined || !firewallRules.length" class="text-center text-danger">No rules found!</div>
            <table v-else class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Protocol</th>
                        <th>Destination IP</th>
                        <th>Destination<br />Port</th>
                        <th>Source IP</th>
                        <th>Source<br />Port</th>
                        <th>XDP Action</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(rule, index) in firewallRules as any[]" :key="index">
                        <td>{{ rule.protocol_id }}</td>
                        <td>{{ rule.destination_ip }}</td>
                        <td>{{ rule.destination_port }}</td>
                        <td>{{ rule.source_ip }}</td>
                        <td>{{ rule.source_port }}</td>
                        <td>{{ rule.xdp_action }}</td>
                        <td>
                            <form :ref="(el) => setFormRef(el, index)" method="POST" @submit.prevent="handleDelete(index)">
                                <input v-model="rule.id" type="hidden" name="rule_id" />
                                <button type="submit" class="border-0" data-toggle="tooltip" title="Delete Firewall Rule">
                                    <i class="fas fa-trash" aria-hidden="true"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <Dialog ref="dialogTarget" command="show-modal" commandfor="dialog">
        <template #dialog-conent>
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="modal-label-firewall" class="modal-title">Create New Firewall</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeDialog">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form :ref="(el) => setFormRef(el, createFilterFormId)" method="POST" @submit.prevent="handleSubmit(createFilterFormId)">
                        <div class="modal-body">
                            <div class="form-group row">
                                <label for="destination" class="col-sm-3 col-form-label">
                                    Destination IP<span class="text-red">*</span>
                                </label>
                                <div class="col-sm-9">
                                    <input id="destination" type="text" class="form-control" name="destination_ip" :value="ip" readonly>
                                    <small id="type_help_destination">IP address is required</small>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="source_ip" class="col-sm-3 col-form-label">Destination Port</label>
                                <div class="col-sm-9">
                                    <input id="destination_port" name="destination_port" class="form-control" value="80">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="protocol" class="col-sm-3 col-form-label">Protocol</label>
                                <div class="col-sm-9">
                                    <select 
                                        id="protocol" name="protocol_id" class="form-control select2"
                                        style="width: 100% !important;">
                                        <option value="1">TCP</option>
                                        <option value="2">UDP</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="source_type" class="col-sm-3 col-form-label">Source IP</label>
                                <div class="col-sm-9">
                                    <input id="destination" type="text" class="form-control" name="source_ip" value="0">
                                </div>
                            </div>
                            <div id="s_network" class="form-group row">
                                <label for="source_ip" class="col-sm-3 col-form-label">Source Port</label>
                                <div class="col-sm-9">
                                    <input id="source_port" name="source_port" class="form-control" value="0">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="action" class="col-sm-3 col-form-label">XDP Action</label>
                                <div class="col-sm-9">
                                    <select id="xdp_action" name="xdp_action" class="form-control select2" style="width: 100% !important;" onchange="xdp_update();">
                                        <option value="1">Block</option>
                                        <option value="0">Whitelist</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="submit" class="btn btn-primary">Create</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeDialog">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </template> 
    </Dialog>
</template>

<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref } from 'vue';
import Dialog from '@/components/Dialog.vue';
import Swal from 'sweetalert2';;
const firewallRules = defineModel('firewallRules', { type: Array });
const id = defineModel('id', { type: Number });
const baseUrl = defineModel('base_url', { type: String });
const forms = new Map<number, HTMLFormElement>();
const setFormRef = (el: any, id: number) => {
    if (el) forms.set(id, el);
};
//Create Filter Modal code
const dialogTarget = ref<InstanceType<typeof Dialog>>();
const showDialog = () => dialogTarget.value?.show();
const closeDialog = () => dialogTarget.value?.close();
const filter_types = defineModel('filter_types', { type: Object });
const ip = defineModel('ip', { type: String });

const createFilterFormId = Math.ceil(Math.random() * 1000000);

const handleSubmit = (form_id: number) => {
    const targetForm = forms.get(form_id);
    if (targetForm) {
        const fd = new FormData(targetForm);
        const formDataValues: Record<string, any> = {};
        for (const pair of (fd as any).entries()) {
            formDataValues[pair[0]] = pair[1];
        }
        try {
            fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/create_rule`, formDataValues).then((response) => {
                if (response && response.success) {
                    Swal.fire({ icon: 'success', html: `<strong>Success!</strong> ${response.text}` }).then(() => {
                        location.reload();
                    });
                } else {
                    Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${response.text}` });
                }
            }).catch(error => {
                Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${error.text} <br/> ${error.errors.map((err: any) => err).join('<br/>')}` });
            });
        } catch (error) {
            Swal.fire({ icon: 'error', html: '<strong>Error!</strong> Unable to create firewall rule at this time.' });
        }
    }
};

const handleDelete = (itemId: number) => {
    Swal.fire({ icon: 'warning', title: 'Are you sure you want to delete this rule?', showCancelButton: true, confirmButtonText: 'Yes' }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: '', html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!', allowOutsideClick: false, showConfirmButton: false});
            const targetForm = forms.get(itemId);
            if (targetForm) {
                const fd = new FormData(targetForm);
                const formDataValues: Record<string, any> = {};
                for (const pair of (fd as any).entries()) {
                    formDataValues[pair[0]] = pair[1];
                }
                try {
                    fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/delete_rule`, formDataValues).then((response) => {
                        Swal.close();
                        if (response && response.success) {
                            Swal.fire({ icon: 'success', html: `<strong>Success!</strong> ${response.text}` });
                            firewallRules.value = firewallRules.value!.filter((item, index) => index !== itemId);
                        } else {
                            Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${response.text}` });
                        }
                    }).catch(error => {
                        Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${error.text} <br/> ${error.errors.map((err: any) => err).join('<br/>')}` });
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({ icon: 'error', html: '<strong>Error!</strong> Unable to delete firewall at this time.' });
                }
            }
        }
    });
};
</script>
