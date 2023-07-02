<script setup>
import { ref, computed } from 'vue';
import { useAccountStore, useSiteStore } from '@/stores';
import { fetchWrapper } from '@/helpers';
const props = defineProps(['data', 'limits', 'ip']);
const data = computed(() => {
    return props.data;
});
const limits = computed(() => {
    return props.limits;
});
const ip = computed(() => {
    return props.ip;
});
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums({ '/home': 'Home', '': 'Account Settings' });
const baseUrl = siteStore.getBaseUrl();

const newLimit = ref({
    start: '',
    end: '',
});

async function deleteRange(start, end) {
    try {
        fetchWrapper
            .delete(`${baseUrl}/account/iplimits`, {
                start: start,
                end: end,
            })
            .then((response) => {
                console.log('delete range success');
                console.log(response);
            });
    } catch (error) {
        console.log('delete range failed');
        console.log(error);
    }
}

async function addRangeSubmit() {
    try {
        fetchWrapper
            .post(`${baseUrl}/account/iplimits`, {
                start: newLimit.value.start,
                end: newLimit.value.end,
            })
            .then((response) => {
                console.log('add range success');
                console.log(response);
            });
    } catch (error) {
        console.log('add range failed');
        console.log(error);
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" title="This Provides a way to limit the IP Addresses your account can login to from adding additional security to your account.">Session IP Security Limits</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="alert alert-info">
                Your Remote IP: <b>{{ ip }}</b>
                <br />
                Enabling IP limits will prevent anyone that is not listed below from logging in. Make sure your IP address is static and will not change in the future.
            </div>
            <form @submit.prevent="addRangeSubmit" enctype="multipart/form-data">
                <table class="table-sm table">
                    <thead>
                        <tr>
                            <th>Start IP</th>
                            <th>End IP</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(limit, idx) in limits" :key="'row' + idx">
                            <td>{{ limit.start }}</td>
                            <td>{{ limit.end }}</td>
                            <td>
                                <a @click.prevent="deleteRange(limit.start, limit.end)" class="btn btn-sm btn-danger"><span class="fa fa-trash"></span> Remove</a>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="text" name="start" v-model="newLimit.start" /></td>
                            <td><input type="text" name="end" v-model="newLimit.end" /></td>
                            <td><button type="submit" class="btn btn-custom btn-sm" name="submit">Add Range</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    </div>
</template>
