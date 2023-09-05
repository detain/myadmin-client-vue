<script setup lang="ts">
import { fetchWrapper, moduleLink } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const ips = ref({});
const baseUrl = siteStore.getBaseUrl();
const id = computed(() => { return props.id; });

function submitForm() {

}

fetchWrapper.get(baseUrl + '/vps/' + id.value + '/reverse_dns').then((response) => {
    console.log('Response:');
    console.log(response);
    ips.value = response.ips;
});
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6 py-5">
            <div class="card b-radius my-3 shadow-none">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-atlas">&nbsp;</i>Reverse DNS</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/'+moduleLink(module)+'/vps/' + id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"> <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp; </router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning" role="alert">Changes to reverse DNS take up to an hour to show up.</div>
                    <template v-if="successMsg">
                        <div class="alert alert-success">{{ successMsg }} {{ cancelQueue }}</div>
                    </template>
                    <form @submit.prevent="submitForm" action="view_vps" method="POST">
                        <input type="hidden" name="link" value="reverse_dns" />
                        <template v-for="(host, ip, index) in ips" :key="index">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">{{ ip }}</label>
                                <div class="col-sm-9 input-group">
                                    <input type="text" class="form-control form-control-sm" :id="ip" :name="ip" v-model="ips[ip]" />
                                </div>
                            </div>
                        </template>
                        <div class="form-group row justify-content-center m-0">
                            <div class="controls">
                                <input type="submit" name="Submit" value="Update Reverse DNS" class="btn btn-order px-3 py-2 text-sm" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
