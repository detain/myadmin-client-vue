<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from "vue";
import { useLayoutStore } from '@/stores';
const props = defineProps(['id', 'settings', 'backupsTable']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const layoutStore = useLayoutStore();
const settings = computed(() => { return props.settings; });
const id = computed(() => { return props.id; });
const backupsTable = computed(() => { return props.backupsTable; });

layoutStore.setTitle('');
layoutStore.setPageHeading('');
layoutStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
layoutStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
layoutStore.addBreadcrum('/vps/'+props.id+'/backups', 'Manage Backups');
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-10">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="material-icons pr-2" style="vertical-align: middle;">backup</i>Manage {{ settings.TBLNAME }} Backups
          </h3>
          <div class="card-tools text-right">
            <a href="view_{{ settings.PREFIX }}?id={{ id }}" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
              <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;
            </a>
          </div>
        </div>
        <div class="card-body mb-0">
          {{ backupsTable }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
