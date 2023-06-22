<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { useAccountStore, useAuthStore, useSiteStore } from "@/stores";
const props = defineProps(['data']);
const data = computed(() => { return props.data; });
const siteStore = useSiteStore();
const accountStore = useAccountStore();
siteStore.setPageHeading('Account Settings');
siteStore.setTitle('Account Settings');
siteStore.setBreadcrums({'/home': 'Home', '': 'Account Settings'});
const baseUrl = import.meta.env.VITE_API_URL;

async function updateSshPublicKey() {
    console.log(data.value.ssh_key);
    try {
        fetchWrapper.post(`${baseUrl}/account/sshkey`, {
            sshKey: data.value.ssh_key
        }).then(response => {
            console.log('updateSshPublicKey success');
            console.log(response);
        });
    } catch (error) {
        console.log('updateSshPublicKey failed');
        console.log(error);
    }
}
</script>

<template>
        <div class="card">
            <div class="card-header">
                <div class="p-1">
                    <h3 class="card-title py-2" v-bind:title="'This SSH Key will automatically get added to some services such as VPS orders providing an alternative means of authentication with your services.'">SSH Keys</h3>
                    <div class="card-tools float-right">
                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fa fas fa-minus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <form method="post" @submit.prevent="updateSshPublicKey" enctype="multipart/form-data" action="account_settings">
                    <div class="row">
                        <textarea class="form-control" rows="6" id="ssh_key" name="ssh_key" placeholder="No SSH Key Setup Yet" v-model="data.ssh_key"></textarea>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <template v-if="data.ssh_key">
                                <input type="submit" class="btn btn-sm btn-green py-2 px-3" name="submit" value="Update SSH Public Key">
                            </template>
                            <template v-else>
                                <input type="submit" class="btn btn-sm btn-green py-2 px-3" name="submit" value="Set SSH Public Key">
                            </template>
                            <br>
                        </div>
                    </div>
                </form>
            </div>
        </div>
</template>
