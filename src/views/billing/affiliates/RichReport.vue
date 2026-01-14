<script setup lang="ts">
import { fetchWrapper } from '../../../helpers/fetchWrapper';
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSiteStore } from '../../../stores/site.store';
import Swal from 'sweetalert2';

const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
siteStore.setPageHeading('Affiliate - RichReport');
siteStore.setTitle('Affiliate - RichReport');
siteStore.setBreadcrums([
    ['/home', 'Home'],
    ['/affiliate', 'Affiliate'],
    ['', 'RichReport'],
]);
const table = ref('');
onMounted(() => {});
try {
    Swal.fire({
        title: '',
        html: '<i class="fa fa-spinner fa-pulse"></i> Please wait!',
        allowOutsideClick: false,
        showConfirmButton: false,
    });
    fetchWrapper.get(`${baseUrl}/affiliate/rich_report`).then((response) => {
        Swal.close();
        console.log('rich report success');
        console.log(response);
        table.value = response.text;
    });
} catch (error: any) {
    Swal.close();
    console.log('vps setup vnc failed');
    console.log(error);
    Swal.fire({
        icon: 'error',
        html: `Got error ${error.text}`,
    });
}
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title py-2"><i class="fa fa-file-text-o">&nbsp;</i>Rich Report</h3>
                        <div class="card-tools float-right">
                            <router-link to="/affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body" v-html="table"></div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
