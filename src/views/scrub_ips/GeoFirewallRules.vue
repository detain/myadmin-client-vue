<template>
    <div class="card">
        <div class="card-header">
            <h3 class="card-title"><i class="fa fa-globe" aria-hidden="true">&nbsp;</i>Geo Firewall Rules</h3>
            <div class="card-tools">
                <button type="button" class="btn-custom text-sm mr-2" data-toggle="modal" data-target="#createNew"><i class="fas fa-plus" aria-hidden="true">&nbsp;</i> Create New Geo</button>
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
</template>

<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import Swal from 'sweetalert2';
const siteStore = useSiteStore();
const geoFirewallRules = defineModel('geoFirewallRules', { type: Array });
const id = defineModel('id', { type: Number });
const baseUrl = siteStore.getBaseUrl();
const forms = new Map<number, HTMLFormElement>();
const setFormRef = (el: any, id: number) => {
    if (el) forms.set(id, el);
};
const handleDelete = (itemId: number) => {
    Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete this geo rule?',
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
                    fetchWrapper.post(`${baseUrl}/scrub_ips/${id.value}/delete_geo_rule`, formDataValues).then((response) => {
                        Swal.close();
                        if (response && response.success) {
                            Swal.fire({
                                icon: 'success',
                                html: `<strong>Success!</strong> ${response.text}`,
                            });
                            geoFirewallRules.value = geoFirewallRules.value!.filter((item, index) => index !== itemId);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: `<strong>Error!</strong> ${response.text}`,
                            });
                        }
                    });
                } catch (error) {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        html: '<strong>Error!</strong> Unable to delete geo firewall at this time.',
                    });
                }
            }
        }
    });
};
</script>
