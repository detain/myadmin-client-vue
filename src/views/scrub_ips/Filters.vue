<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title"><i class="fa fa-link" aria-hidden="true">&nbsp;</i>Filters</h3>
            <div class="card-tools">
                <button type="button" class="btn-custom text-sm mr-2" data-toggle="modal" data-target="#createNewFilter"><i class="fas fa-plus" aria-hidden="true">&nbsp;</i> Create New</button>
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
                                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const id = defineModel('id', { type: Number });
const filters = defineModel('filters', { type: Array });
const baseUrl = siteStore.getBaseUrl();
const forms = new Map<number, HTMLFormElement>();
const setFormRef = (el: any, id: number) => {
    if (el) forms.set(id, el);
};

const handleDelete = (itemId: number) => {
    //if (!window.confirm("Are you sure you want to delete this item?")) return;
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
                    fetchWrapper.post(`${baseUrl}/scrub_ips/${id.value}/delete_filter`, formDataValues).then((response) => {
                        Swal.close();
                        if (response && response.success) {
                            Swal.fire({
                                icon: 'success',
                                html: `<strong>Success!</strong> ${response.text}`,
                            });
                            filters.value = filters.value!.filter((item, index) => index !== itemId);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: `${response.text}`,
                            });
                        }
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        html: '<strong>Error!</strong> Unable to delete filter at this time.',
                    });
                }
            }
        }
    });
};
</script>
