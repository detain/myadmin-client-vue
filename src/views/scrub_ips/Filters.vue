<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title"><i class="fa fa-link" aria-hidden="true">&nbsp;</i>Filters</h3>
            <div class="card-tools">
                <button type="button" class="btn-custom text-sm mr-2" @click="showDialog">
                    <i class="fas fa-plus" aria-hidden="true">&nbsp;</i> Create New
                </button>
            </div>
        </div>
        <div class="card-body pt-5">
            <div v-if="filters != undefined && !filters.length" class="text-center text-danger">No filters found!</div>
            <table v-else class="table table-sm table-bordered">
                <thead>
                    <tr>
                        <th>Filter</th>
                        <th>Destination IP</th>
                        <th>Destination Port</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(filter, index) in filters as any[]" :key="index">
                        <td>{{ filter['filter'] }}</td>
                        <td>{{ filter['destination_ip'] }}</td>
                        <td>{{ filter['dest'] }}</td>
                        <td>
                            <form :ref="(el) => setFormRef(el, index)" method="POST" @submit.prevent="handleDelete(index)">
                                <input v-model="filter.filter_name" type="hidden" name="filter_type" />
                                <input v-model="filter.dest" type="hidden" name="port" />
                                <button type="submit" class="border-0" data-toggle="tooltip" title="Delete Filter">
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
                        <h5 id="modal-label" class="modal-title">Create New Filter</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeDialog">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form :ref="(el) => setFormRef(el, createFilterFormId)" method="POST" @submit.prevent="handleSubmit(createFilterFormId)">
                        <div class="modal-body">
                            <div class="form-group row">
                                <label for="filter_type" class="col-sm-4 col-form-label">Filter Type</label>
                                <div class="col-sm-8">
                                    <select 
                                        id="filter_type" name="filter_type" class="form-control form-control-sm select2"
                                            style="width: 100% !important;" required>
                                        <option value="">Select Filter Type</option>
                                        <option v-for="type, key in filter_types" :key="type.value" :value="key">{{ type.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="ip" class="col-sm-4 col-form-label">IP Address</label>
                                <div class="col-sm-8">
                                    <input id="ip" type="text" readonly class="form-control-plaintext" :value="ip">
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="port" class="col-sm-4 col-form-label">Port No</label>
                                <div class="col-sm-8">
                                    <input id="port" type="text" name="port" class="form-control" value="80">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
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
    import Dialog from '@/components/Dialog.vue';
    import Swal from 'sweetalert2';
    import { ref } from 'vue';
    const id = defineModel('id', { type: Number });
    const filters = defineModel('filters', { type: Array });
    const baseUrl = defineModel('base_url', { type: String });
    const forms = new Map<number, HTMLFormElement>();
    const createFilterFormId = Math.ceil(Math.random()*1000000);

    //Create Filter Modal code
    const dialogTarget = ref<InstanceType<typeof Dialog>>();
    const showDialog = () => dialogTarget.value?.show();
    const closeDialog = () => dialogTarget.value?.close();
    const setFormRef = (el: any, id: number) => {
        if (el) forms.set(id, el);
    };
    const filter_types = defineModel('filter_types', { type: Object });
    const ip = defineModel('ip', { type: String });

    const handleSubmit = (form_id: number) => {
        const targetForm = forms.get(form_id);
        if (targetForm) {
            const fd = new FormData(targetForm);
            const formDataValues: Record<string, any> = {};
            for (const pair of (fd as any).entries()) {
                formDataValues[pair[0]] = pair[1];
            }
            try {
                fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/create_filter`, formDataValues).then((response) => {
                    if (response && response.success) {
                        Swal.fire({ icon: 'success',html: `<strong>Success!</strong> ${response.text}` }).then((result) => {
                            if (result.isConfirmed) {
                               window.location.reload();
                            }
                        });
                        closeDialog();
                    } else {
                        Swal.fire({ icon: 'error', html: `${response.text}` });
                    }
                }).catch(error => {
                    Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${error.text} <br/> ${error.errors.map((err: any) => err).join('<br/>')}` });
                });
            } catch (error) {
                Swal.fire({ icon: 'error', html: '<strong>Error!</strong> Unable to create filter at this time.'});
            }
        }
    };

const handleDelete = (itemId: number) => {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete this filter?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
                allowOutsideClick: false,
                showConfirmButton: false,
            });
            const targetForm = forms.get(itemId);
            if (targetForm) {
                const fd = new FormData(targetForm);
                const formDataValues: Record<string, any> = {};
                for (const pair of (fd as any).entries()) {
                    formDataValues[pair[0]] = pair[1];
                }
                try {
                    fetchWrapper.post(`${baseUrl.value}/scrub_ips/${id.value}/delete_filter`, formDataValues).then((response) => {
                        Swal.close();
                        if (response && response.success) {
                            Swal.fire({ icon: 'success', html: `<strong>Success!</strong> ${response.text}` });
                            filters.value = filters.value!.filter((item, index) => index !== itemId);
                        } else {
                            Swal.fire({ icon: 'error', html: `${response.text}` });
                        }
                    }).catch(error => {
                        Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${error.text} <br/> ${error.errors.map((err: any) => err).join('<br/>')}` });
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({ icon: 'error', html: '<strong>Error!</strong> Unable to delete filter at this time.' });
                }
            }
        }
    });
};
</script>
