<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id', 'settings', 'backupsTable']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
const settings = computed(() => {
  return props.settings;
});
const id = computed(() => {
  return props.id;
});
const backupsTable = computed(() => {
  return props.backupsTable;
});

siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums({ '/home': 'Home', '/vps': 'VPS' });
siteStore.addBreadcrum('/vps/' + props.id, 'View VPS ' + props.id);
siteStore.addBreadcrum('/vps/' + props.id + '/backups', 'Manage Backups');
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-10">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>Manage {{ settings.TBLNAME }} Backups</h3>
          <div class="card-tools text-right">
            <router-link :to="'/vps/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
          </div>
        </div>
        <div class="card-body mb-0">
          {{ backupsTable }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
