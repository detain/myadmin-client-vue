<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { moduleLink } from '@/helpers/moduleLink';
import { useRoute, RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
const authStore = useAuthStore();
const props = defineProps<{
    id: number;
}>();
const { sessionId } = storeToRefs(authStore);
const module: string = 'servers';
const route = useRoute();
const errorMsg = ref('');
const id = computed(() => props.id);
const port = ref(route.query.port);
const graphs = ref({ daily: 1, weekly: 2, monthly: 3, yearly: 4, total: 5 });
const graphTitle = ref('Bandwidth Graph');
const ranges = ref([0, '1d', '1w', '31d', '365d', 'all']);
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
                            <router-link :to="'/' + moduleLink(module) + '/' + id" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <div v-for="(period, name) in graphs" :key="name">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title py-2"><i class="fa fa-line-chart">&nbsp;</i>{{ name }} {{ graphTitle }}</h3>
                                    <div class="card-tools float-right">
                                        <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                                <div class="card-body justify-content-center mx-auto">
                                    <img :src="`https://my.interserver.net/image_proxy.php?port=${port}&width=1000&graph_start=${ranges[Number(period)]}&graph_end=0&use_variable_sessionid=true&sessionid=${sessionId}`" :alt="graphTitle" />
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
