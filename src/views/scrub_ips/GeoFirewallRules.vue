<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa fa-globe" aria-hidden="true">&nbsp;</i>Geo Firewall Rules</h3>
                    <div class="card-tools">
                    <button type="button" class="btn-custom text-sm mr-2" @click="showDialog">
                        <i class="fas fa-plus" aria-hidden="true">&nbsp;</i> Create New
                    </button>
                </div>
                </div>
                <div class="card-body pt-5">
                    <div v-if="geoFirewallRules == undefined || !geoFirewallRules.length" class="text-center text-danger">No rules found!</div>
                    <table v-else class="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>Destination IP</th>
                                <th>Destination<br>Port</th>
                                <th>Source Country</th>
                                <th>Source Asn</th>
                                <th>XDP Action</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(rule, index) in geoFirewallRules as any[]" :key="index">
                                <td>{{ rule.destination_ip }}</td>
                                <td>{{ rule.dest }}</td>
                                <td>{{ rule.src_country_code }}</td>
                                <td>{{ rule.src_asn }}</td>
                                <td>{{ rule.xdp_action }}</td>
                                <td>
                                    <form :ref="(el) => setFormRef(el, index)" method="POST" @submit.prevent="handleDelete(index)">
                                        <input v-model="rule.id" type="hidden" name="rule_id" />
                                        <button type="submit" class="border-0" data-toggle="tooltip" title="Delete Geo Firewall Rule">
                                            <i class="fas fa-trash" aria-hidden="true"></i>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <Teleport to="body">
        <Dialog ref="dialogTarget" command="show-modal" commandfor="dialog">
            <template #dialog-conent>
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 id="modal-label" class="modal-title">Create New Geo Firewall Rule</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeDialog">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form :ref="(el) => setFormRef(el, createFilterFormId)" method="POST" @submit.prevent="handleSubmit(createFilterFormId)">
                            <div class="modal-body">
                                <div class="form-group row">
                                    <label for="ip" class="col-sm-4 col-form-label">Destination IP</label>
                                    <div class="col-sm-8">
                                        <input id="ip" type="text" readonly class="form-control-plaintext" :value="ip">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="port" class="col-sm-4 col-form-label">Port No</label>
                                    <div class="col-sm-8">
                                        <input id="port" type="text" name="destination_port" class="form-control" value="80">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="filter_type" class="col-sm-4 col-form-label">Select Country</label>
                                    <div class="col-sm-8">
                                        <select id="countries" name="country_code" class="form-control select2" style="width: 100% !important;" required>
                                            <option value="">Select Country</option>
                                            <option v-for="numcode, key in countries" :key="key" :value="key">{{ numcode }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="asn" class="col-sm-4 col-form-label">ASN</label>
                                    <div class="col-sm-8">
                                        <input id="asn" type="text" name="asn" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="xdp_action" class="col-sm-4 col-form-label">XDP Action</label>
                                    <div class="col-sm-8">
                                        <select id="xdp_action" name="xdp_action" class="form-control select2" style="width: 100% !important;" required>
                                            <option value="1">Block</option>
                                            <option value="0">Whitelist</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer justify-content-center">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeDialog">Close</button>
                                <button type="submit" class="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </template> 
        </Dialog>
    </Teleport>
</template>

<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import Dialog from '@/components/Dialog.vue';

const geoFirewallRules = defineModel('geoFirewallRules', { type: Array });
const id = defineModel('id', { type: Number });
const ip = defineModel('ip', { type: String });
const baseUrl = defineModel('base_url', { type: String });
const countries = defineModel('countries', { type: Array });
const forms = new Map<number, HTMLFormElement>();
const setFormRef = (el: any, id: number) => {
    if (el) forms.set(id, el);
};

//Create Filter Modal code
const dialogTarget = ref<InstanceType<typeof Dialog>>();
const showDialog = () => dialogTarget.value?.show();
const closeDialog = () => dialogTarget.value?.close();
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
            fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/create_geo_rule`, formDataValues).then((response) => {
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
    Swal.fire({
        icon: 'warning', title: 'Are you sure you want to delete this geo rule?', showCancelButton: true, confirmButtonText: 'Yes',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '', html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!', allowOutsideClick: false, showConfirmButton: false,
            });
            const targetForm = forms.get(itemId);
            if (targetForm) {
                const fd = new FormData(targetForm);
                const formDataValues: Record<string, any> = {};
                for (const pair of (fd as any).entries()) {
                    formDataValues[pair[0]] = pair[1];
                }
                try {
                    fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/delete_geo_rule`, formDataValues).then((response) => {
                        Swal.close();
                        if (response && response.success) {
                            Swal.fire({ icon: 'success', html: `<strong>Success!</strong> ${response.text}` });
                            geoFirewallRules.value = geoFirewallRules.value!.filter((item, index) => index !== itemId);
                        } else {
                            Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${response.text}}` });
                        }
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({ icon: 'error', html: '<strong>Error!</strong> Unable to delete geo firewall at this time.'});
                }
            }
        }
    });
};
</script>
