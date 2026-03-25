<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-globe" aria-hidden="true"></i>{{ t('scrub_ips.geoFirewallRules.title') }}</h3>
                    <div class="card-tools">
                        <button type="button" class="btn-custom text-sm me-2" @click="showDialog"><i class="fas fa-plus" aria-hidden="true"></i> {{ t('scrub_ips.geoFirewallRules.createNew') }}</button>
                    </div>
                </div>
                <div class="card-body pt-5">
                    <div v-if="geoFirewallRules == undefined || !geoFirewallRules.length" class="text-center text-danger">{{ t('scrub_ips.geoFirewallRules.noRulesFound') }}</div>
                    <table v-else class="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th>{{ t('scrub_ips.geoFirewallRules.destinationIp') }}</th>
                                <th>{{ t('scrub_ips.geoFirewallRules.destinationPort') }}</th>
                                <th>{{ t('scrub_ips.geoFirewallRules.sourceCountry') }}</th>
                                <th>{{ t('scrub_ips.geoFirewallRules.sourceAsn') }}</th>
                                <th>{{ t('scrub_ips.geoFirewallRules.xdpAction') }}</th>
                                <th>{{ t('common.labels.actions') }}</th>
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
                                        <button type="submit" class="border-0" data-bs-toggle="tooltip" :title="t('common.buttons.delete')">
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
                            <h5 id="modal-label" class="modal-title">{{ t('scrub_ips.geoFirewallRules.createNewGeoRule') }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeDialog"></button>
                        </div>
                        <form :ref="(el) => setFormRef(el, createFilterFormId)" method="POST" @submit.prevent="handleSubmit(createFilterFormId)">
                            <div class="modal-body">
                                <div class="mb-3 row">
                                    <label for="ip" class="col-sm-4 col-form-label">{{ t('scrub_ips.geoFirewallRules.destinationIp') }}</label>
                                    <div class="col-sm-8">
                                        <input id="ip" type="text" readonly class="form-control-plaintext" :value="ip" />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="port" class="col-sm-4 col-form-label">{{ t('scrub_ips.geoFirewallRules.portNo') }}</label>
                                    <div class="col-sm-8">
                                        <input id="port" type="text" name="destination_port" class="form-control" value="80" />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="filter_type" class="col-sm-4 col-form-label">{{ t('scrub_ips.geoFirewallRules.selectCountry') }}</label>
                                    <div class="col-sm-8">
                                        <select id="countries" name="country_code" class="form-control select2" style="width: 100% !important" required>
                                            <option value="">{{ t('scrub_ips.geoFirewallRules.selectCountry') }}</option>
                                            <option v-for="(numcode, key) in countries" :key="key" :value="key">{{ numcode }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="asn" class="col-sm-4 col-form-label">{{ t('scrub_ips.geoFirewallRules.asn') }}</label>
                                    <div class="col-sm-8">
                                        <input id="asn" type="text" name="asn" class="form-control" />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="xdp_action" class="col-sm-4 col-form-label">{{ t('scrub_ips.geoFirewallRules.xdpAction') }}</label>
                                    <div class="col-sm-8">
                                        <select id="xdp_action" name="xdp_action" class="form-control select2" style="width: 100% !important" required>
                                            <option value="1">{{ t('scrub_ips.geoFirewallRules.block') }}</option>
                                            <option value="0">{{ t('scrub_ips.geoFirewallRules.whitelist') }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer justify-content-center">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeDialog">{{ t('common.buttons.close') }}</button>
                                <button type="submit" class="btn btn-primary">{{ t('common.buttons.create') }}</button>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
            fetchWrapper
                .post(`${baseUrl.value}/scrub_ips/${id.value}/create_geo_rule`, formDataValues)
                .then((response) => {
                    if (response && response.success) {
                        Swal.fire({ icon: 'success', html: `<strong>Success!</strong> ${response.text}` }).then(() => {
                            location.reload();
                        });
                    } else {
                        Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${response.text}` });
                    }
                })
                .catch((error) => {
                    Swal.fire({ icon: 'error', html: `<strong>Error!</strong> ${error.text} <br/> ${error.errors.map((err: any) => err).join('<br/>')}` });
                });
        } catch (error) {
            Swal.fire({ icon: 'error', html: `<strong>${t('common.alerts.error')}</strong> ${t('scrub_ips.geoFirewallRules.unableToCreateRule')}` });
        }
    }
};
const handleDelete = (itemId: number) => {
    Swal.fire({
        icon: 'warning',
        title: t('scrub_ips.geoFirewallRules.deleteGeoRuleConfirm'),
        showCancelButton: true,
        confirmButtonText: t('common.labels.yes'),
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: '',
                html: '<i class="fas fa-spinner fa-pulse"></i> Please wait!',
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
                    Swal.fire({ icon: 'error', html: `<strong>${t('common.alerts.error')}</strong> ${t('scrub_ips.geoFirewallRules.unableToDeleteRule')}` });
                }
            }
        }
    });
};
</script>
