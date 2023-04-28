<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - WebTraffic');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'WebTraffic'});


onMounted(() => {
})
</script>

<template>
<div class="row justify-content-center">
    <div class="col-md-10">
        <div class="card">
            <div class="card-header">
                <div class="p-1" ?>
                    <h3 class="card-title py-2">
                        <i class="fa fa-globe">&nbsp;</i>Web Traffic
                    </h3>
                    <div class="card-tools float-right">
                        <a href="affiliate" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                            <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
                        </a>
                    </div>
                </div>
            </div>
            <div class="card-body">
                {{ table }}
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
</style>
