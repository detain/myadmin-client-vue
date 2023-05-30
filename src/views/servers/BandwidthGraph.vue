<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useLayoutStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const layoutStore = useLayoutStore();
layoutStore.setTitle('');
layoutStore.setPageHeading('');
layoutStore.setBreadcrums({'/home': 'Home', '/servers': 'Servers'})
layoutStore.addBreadcrum('/servers/'+props.id, 'View Server '+props.id);
layoutStore.addBreadcrum('/servers/'+props.id+'/', '');

export default {
  data() {
    return {
      errorMsg: '', // Replace with actual data property
      id: '', // Replace with actual data property
      graphs: {}, // Replace with actual data property
      graphTitle: '', // Replace with actual data property
      graphLink: '', // Replace with actual data property
      ranges: {}, // Replace with actual data property
    };
  },
  methods: {
    toggleCollapse(name) {
      // Add the toggle collapse logic here
    },
  },
  filters: {
    capitalize(value) {
      // Add the capitalize filter logic here
    },
  },
};
</script>

<template>
  <div>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title py-2">
              <i class="fa fa-line-chart">&nbsp;</i>Bandwidth Graphs
            </h3>
            <div class="card-tools float-right">
              <a href="index.php?choice=none.view_server&id={{ id }}" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back">
                <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
              </a>
            </div>
          </div>
          <div class="card-body">
            <div v-for="(period, name) in graphs" :key="name">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title py-2">
                    <i class="fa fa-line-chart">&nbsp;</i>{{ name | capitalize }} {{ graphTitle }}
                  </h3>
                  <div class="card-tools float-right">
                    <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse" @click="toggleCollapse(name)">
                      <i class="fas fa-minus" aria-hidden="true"></i>
                    </button>
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

<style scoped>
</style>
