<script setup lang="ts">
import { computed } from 'vue';
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { useSiteStore } from '../../stores/site.store';
import type { AccountData } from '../../types/account.ts';

const props = defineProps<{
    data: AccountData;
}>();
const data = computed(() => {
    return props.data;
});
const siteStore = useSiteStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['', 'Account Settings'],
]);
const baseUrl = siteStore.getBaseUrl();

async function updateFeatures() {
    try {
        fetchWrapper
            .post(`${baseUrl}/account/features`, {
                disable_reinstall: data.value.disable_reinstall,
                disable_reset: data.value.disable_reset,
            })
            .then((response) => {
                console.log('update Features success');
                console.log(response);
            });
    } catch (error: any) {
        console.log('update Features failed');
        console.log(error);
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="p-1">
                <h3 class="card-title py-2" title="">Account Features</h3>
                <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <form method="post" enctype="multipart/form-data" @submit.prevent="updateFeatures">
                <div class="row ml-5 pl-5">
                    <div class="icheck-success d-inline">
                        <input id="disreins" v-model="data.disable_reinstall" type="checkbox" name="disable_reinstall" value="1" />
                        <label for="disreins"
                            >Disable Re-installs
                            <div style="font-weight: normal">Note: To disable reinstall create new ticket, our support team will help</div>
                        </label>
                    </div>
                </div>
                <div class="row ml-5 pl-5">
                    <div class="icheck-success d-inline">
                        <input id="disreset" v-model="data.disable_reset" type="checkbox" name="disable_reset" value="1" />
                        <label for="disreset">Disable (Forgot your Password) Password Resets.</label>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12 text-center"><input type="submit" class="btn btn-green btn-sm px-3 py-2" value="Update Account Features Settings" /><br /></div>
                </div>
            </form>
        </div>
    </div>
</template>
