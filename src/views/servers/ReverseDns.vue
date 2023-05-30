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
      id: '', // Replace with actual data
      csrfToken: '', // Replace with actual data
      ipLabelListSet: {}, // Replace with actual data
      ipInputNameSet: {}, // Replace with actual data
      ipInputValueSet: {}, // Replace with actual data
      ipInputListUpdated: '', // Replace with actual data
    };
  },
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2">
              <i class="fa fa-atlas">&nbsp;</i>Reverse DNS Settings
            </h3>
            <div class="card-tools float-right">
              <a
                href="index.php?choice=none.view_server&id={{ id }}"
                class="btn btn-custom btn-sm"
                data-toggle="tooltip"
                title="Go Back"
              >
                <i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="alert alert-warning" role="alert">
            Changes to reverse dns take up to an hour to show up.
          </div>
          <form
            id="reverse_dns_form"
            accept-charset="UTF-8"
            role="form"
            :action="`view_server?id=${id}&link=reverse_dns`"
            method="POST"
          >
            <input type="hidden" name="choice" value="none.view_dedicated_server" />
            <input type="hidden" name="csrf_token" :value="csrfToken" />
            <input type="hidden" name="link" value="reverse_dns" />
            <div class="form-group row">
              <label class="col-md-3 col-form-label">IP Addresses</label>
              <div class="col-sm-9 input-group">
                <label class="col-md-9 col-form-label">Hostnames</label>
              </div>
            </div>
            <div v-for="(v, k) in ipLabelListSet" :key="k" class="form-group row">
              <label class="col-md-3 col-form-label">{{ v }}</label>
              <div class="col-sm-9 input-group">
                <input
                  v-if="ipInputNameSet[k]"
                  :id="ipInputNameSet[k]"
                  :name="ipInputNameSet[k]"
                  type="text"
                  class="form-control form-control-sm"
                  :value="ipInputValueSet[k]"
                />
              </div>
            </div>
            <div v-if="ipInputListUpdated" class="alert alert-success">
              {{ ipInputListUpdated }}
            </div>
            <hr />
            <div class="form-group row">
              <div class="controls col-md-12 text-center">
                <input
                  type="submit"
                  name="Submit"
                  value="Update Reverse DNS"
                  class="btn btn-sm btn-order px-3 py-2"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
