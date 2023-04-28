<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/stores';
import Chart from 'chart.js';
const layoutStore = useLayoutStore();
const { breadcrums, page_heading } = storeToRefs(layoutStore);
layoutStore.setPageHeading('Affiliate - TrafficGraph');
layoutStore.setBreadcrums({'home': 'Home', 'affiliate': 'Affiliate', '': 'TrafficGraph'});

const selectedPeriod = ref(30);

function createGraph() {
  const ctx = graph.value.getContext('2d');
  new Chart(ctx, {
    // your chart configuration here
  });
}

onMounted(() => {
      createGraph();
})
</script>

<template>
    <div class="row justify-content-center mt-4">
        <div class="col-md-10">
            <div class="card">
                <div class="card-header">
                    <div class="p-1">
                        <h3 class="card-title"><i class="fa fa-line-chart" aria-hidden="true">&nbsp;</i>Web Traffic Graph</h3>
                        <div class="card-tools float-right">
                            <a href="affiliate" class="btn btn-sm btn-custom" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <form>
                        <div class="form-group row mb-4 justify-content-center">
                            <label class="col-sm-2 col-form-label text-right">Select<span class="text-danger"> *</span></label>
                            <div class="col-sm-7 input-group">
                                <select v-model="selectedPeriod" @change="anotherPeriod" id="graph_period" name="graph_period" class="form-control form-control-sm select2">
                                    <option value="30" :selected="trafficDays == 30">Last 30 Days</option>
                                    <option value="90" :selected="trafficDays == 90">Last 3 months</option>
                                    <option value="180" :selected="trafficDays == 180">Last 6 months</option>
                                    <option value="270" :selected="trafficDays == 270">Last 9 months</option>
                                    <option value="365" :selected="trafficDays == 365">Last 1 year</option>
                                </select>
                            </div>
                        </div>
                    </form>
                    <div>
                        <canvas ref="graph" width="400" height="100"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '/node_modules/chart.js/dist/Chart.min.css';
</style>
