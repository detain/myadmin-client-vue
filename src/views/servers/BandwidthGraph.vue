<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps<{
    id: number;
}>();
const module: string = 'servers';
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();

const errorMsg = ref('');
//const id = ref('');
const graphs = ref({});
const graphTitle = ref('');
const graphLink = ref('');
const ranges = ref({});
function toggleCollapse() {
    // Add the toggle collapse logic here
}
</script>

<template>
    <div>
        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title py-2"><i class="fa fa-line-chart">&nbsp;</i>Bandwidth Graphs</h3>
                        <div class="card-tools float-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-for="(period, name) in graphs" :key="name">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title py-2"><i class="fa fa-line-chart">&nbsp;</i>{{ name }} {{ graphTitle }}</h3>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse" @click="toggleCollapse()"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                                <div class="card-body justify-content-center mx-auto">
                                    <template v-if="graphLink">
                                        <img :src="`${graphLink}&graph_start=${ranges[graphs[name]]}&graph_end=0`" :alt="graphTitle" />
                                    </template>
                                    <template v-else>
                                        <div class="alert alert-info">Sorry! No Graph found.</div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
