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
layoutStore.setBreadcrums({'/home': 'Home', '/websites': 'Websites'})
layoutStore.addBreadcrum('/websites/'+props.id, 'View Website '+props.id);
layoutStore.addBreadcrum('/websites/'+props.id+'/', '');

export default {
  data() {
    return {
      id: '', // Replace with appropriate data or pass as props
      csrf: '', // Replace with appropriate data or pass as props
      success_msg: '', // Replace with appropriate data or pass as props
      cancel_queue: '', // Replace with appropriate data or pass as props
      fields: {}, // Replace with appropriate data or pass as props
    };
  },
  methods: {
    submitForm() {
      // Perform necessary form submission logic here
    },
  },
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 py-5">
      <div class="card shadow-none b-radius my-3">
        <div class="card-header">
          <div class="p-1">
            <h3 class="card-title py-2"><i class="fa fa-atlas">&nbsp;</i>Reverse DNS</h3>
            <div class="card-tools text-right">
              <a href="view_website?id={{ id }}" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
                <i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>
        <div class="card-body">
          <template v-if="success_msg">
            <div class="alert alert-success">{{ success_msg }} {{ cancel_queue }}</div>
          </template>
          <form @submit.prevent="submitForm" action="view_website?id={{ id }}&link=reverse_dns" method="POST">
            <input type="hidden" name="link" value="reverse_dns">
            <input type="hidden" name="csrf_token" :value="csrf">
            <template v-for="(field_details, field_name) in fields">
              <template v-if="field_details.help_text">
                <div class="alert alert-success">{{ field_details.help_text }}</div>
              </template>
              <div class="form-group row">
                <label class="col-md-3 col-form-label">{{ field_name }}</label>
                <div class="col-sm-9 input-group">
                  <input type="text" class="form-control form-control-sm" :id="field_details.name"
                    name="host_name" :value="field_details.value" required>
                </div>
              </div>
            </template>
            <div class="form-group row justify-content-center m-0">
              <div class="controls">
                <input type="submit" name="Submit" value="Update Reverse DNS"
                  class="btn btn-order px-3 py-2 text-sm" />
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
