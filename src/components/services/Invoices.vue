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
layoutStore.setBreadcrums({'/home': 'Home', '/vps': 'VPS'})
layoutStore.addBreadcrum('/vps/'+props.id, 'View VPS '+props.id);
layoutStore.addBreadcrum('/vps/'+props.id+'/', '');


export default {
  name: 'Invoices',
  data() {
    return {
      dataSets: JSON.parse('<?php echo json_encode($invoices_array.invoices); ?>'),
      eDataSet: JSON.parse('<?php echo json_encode($invoices_array.one_array); ?>'),
      prefixes: JSON.parse('<?php echo json_encode($invoices_array.prefixes); ?>'),
      post_location: 'index.php',
      login_ima: '<?php echo $ima; ?>',
      invoicesId: '',
      invoicesDescription: '',
      // Rest of the data properties
    };
  },
  methods: {
    previous() {
      // Handle previous button click
    },
    closeModal() {
      // Handle modal close button click
    },
    submitForm() {
      // Handle form submission
    },
  },
};
</script>

<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-12">
      <div class="card shadow-none">
        <div class="card-header">
          <h3 class="card-title"><i class="fa fa-file-invoice-dollar">&nbsp;</i>Invoices</h3>
          <div class="card-tools">
            <button class="btn-custom text-sm" @click="previous" data-toggle="tooltip" title="Go Back">
              <i class="fas fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;
            </button>
          </div>
        </div>
        <div class="card-body row justify-content-center">
          <table id="invoice_table" class="table table-bordered mt-2">
            <thead>
              <tr>
                <th>More Details</th>
                <th>ID</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Links</th>
              </tr>
            </thead>
          </table>
          <div v-if="ima === 'admin'" class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="edit" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <form accept-charset="UTF-8" role="form" id="editModalForm" class="form" action="ajax.php?choice=invoices_update" autocomplete="on" method="POST" enctype="multipart/form-data" _lpchecked="1">
                  <input type="hidden" name="id" id="invoices_id" :value="invoicesId">
                  <div class="modal-header">
                    <h4 class="modal-title custom_align" id="editModalLabel">Edit Invoice <strong id="invoices_id_text">{{ invoicesId }}</strong></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal"><span aria-hidden="true">×</span></button>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="col-md-6 col-sm-9">
                        <div class="form-group">
                          <label class="col-form-label" for="invoices_description">Description</label>
                          <input type="text" class="form-control" name="invoices_description" id="invoices_description" v-model="invoicesDescription" placeholder="What the Invoice was for" autocomplete="off">
                        </div>
                      </div>
                      <!-- Rest of the form fields -->
                    </div>
                    <div class="error_message"></div>
                  </div>
                  <div class="modal-footer">
                    <button type="submit" id="editModalUpdateButton" class="btn btn-primary btn-lg" @click="submitForm">
                      <span class="fa fa-check-circle"></span> Update
                    </button>
                    <button type="button" id="editModalCancelButton" class="btn btn-danger btn-lg" data-dismiss="modal" @click="closeModal">
                      <span class="fa fa-remove"></span> Cancel
                    </button>
                  </div>
                </form>
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
