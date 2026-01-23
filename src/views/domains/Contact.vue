<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import { DomainFields } from '../../types/domains';
import { moduleLink } from '../../helpers/moduleLink.ts';
const props = defineProps<{
    id: number;
}>();
const id = computed(() => props.id);
const module: string = 'domains';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const domainFields = ref<DomainFields>({});

const updateContact = () => {
    // Handle contact update logic here
};

async function loadContact() {
    try {
        fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/contact`).then((response: DomainFields) => {
            console.log(response);
            domainFields.value = response;
        });
    } catch (error: any) {
        console.log('error:');
        console.log(error);
    }
}

loadContact();
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fas fa-address-card"></i>&nbsp;Contact Information</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/domains/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form v-if="Object.keys(domainFields).length" method="POST" @submit.prevent="updateContact">
                        <div v-for="(fieldData, fieldName, fieldIndex) in domainFields" :key="fieldIndex" class="form-group row">
                            <template v-if="fieldData.label && fieldData.label">
                                <label class="col-sm-3 col-form-label" :for="String(fieldName)">{{ fieldData.label }}<span v-if="fieldData.required" class="text-danger"> *</span></label>
                            </template>
                            <div class="col-sm-9 input-group">
                                <template v-if="fieldData.input === 'text'">
                                    <input type="text" :name="String(fieldName)" class="form-control form-control-sm" :value="fieldData.value" :tabindex="fieldIndex + 1" />
                                </template>
                                <template v-else-if="fieldData.input && fieldData.input[0] === 'select'">
                                    <select :name="String(fieldName)" class="form-control form-control-sm select2" :tabindex="fieldIndex + 1">
                                        <option v-for="(displayName, val, index) in fieldData.input[1]" :key="index" :value="val" :selected="fieldData.value === val">{{ displayName }}</option>
                                    </select>
                                </template>
                                <template v-if="fieldData.tip">
                                    <div class="input-group-append">
                                        <span style="cursor: pointer" class="input-group-text" data-toggle="popover" data-container="body" data-html="true" :data-content="`<p style='text-align: left;'>${fieldData.tip}</p>`" :data-original-title="`<div style='text-align: left; font-weight: bold;'>Tip for ${fieldData.label}</div>`">
                                            <i class="fa text-info fa-question"></i>
                                        </span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-12 text-center">
                                <input type="submit" name="Submit" value="Update" class="btn btn-custom btn-md px-4 py-2" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
