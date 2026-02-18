<script setup lang="ts">
import { computed } from 'vue';
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { useSiteStore } from '@/stores/site.store';
import type { AccountData } from '@/types/account';
import { useDarkMode } from '@/helpers/useDarkMode';

const { isDarkMode } = useDarkMode();
const props = defineProps<{
    data: AccountData;
}>();
const data = computed(() => props.data);
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

<script lang="ts">
export default {
    name: 'AccountFeatures',
};
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
            <hr class="mt-0" />
            <div class="mt-3 mb-4" style="height: 15px">
                <div class="float-left"><b>Enable Dark Mode</b></div>
                <div class="custom-control custom-switch float-right">
                    <input id="dark-mode-switch" v-model="isDarkMode" type="checkbox" class="custom-control-input" />
                    <label class="custom-control-label" for="dark-mode-switch"></label>
                </div>
            </div>
            <hr />
            <form method="post" enctype="multipart/form-data" @submit.prevent="updateFeatures">
                <div class="row ml-5 pl-5">
                    <div class="icheck-success d-inline">
                        <input id="disable-reinstall" v-model="data.disable_reinstall" type="checkbox" name="disable_reinstall" value="1" />
                        <label for="disable-reinstall"> Disable Re-installs </label>
                    </div>
                </div>
                <div class="row ml-5 pl-5">
                    <div class="icheck-success d-inline">
                        <input id="disable-reset" v-model="data.disable_reset" type="checkbox" name="disable_reset" value="1" />
                        <label for="disable-reset">Disable (Forgot your Password) Password Resets.</label>
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
