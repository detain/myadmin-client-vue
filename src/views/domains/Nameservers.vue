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
layoutStore.setBreadcrums({'/home': 'Home', '/domains': 'Domains'})
layoutStore.addBreadcrum('/domains/'+props.id, 'View Domain '+props.id);
layoutStore.addBreadcrum('/domains/'+props.id+'/', '');

import Swal from 'sweetalert2';

export default {
  data() {
    return {
      id: "{$id}",
      suggested: "{$suggested}",
      nameservers: "{$nameservers}",
      registered_nameservers: "{$registered_nameservers}",
      domain_id: "{$domain_id}",
      csrf_token: "{$csrf_token}",
      csrf_token1: "{$csrf_token1}",
    };
  },
  mounted() {
    this.initializeToast();
  },
  methods: {
    initializeToast() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-middle',
        showConfirmButton: false,
        timer: 5000,
      });
      this.$nextTick(() => {
        if (this.suggested && this.suggested.length) {
          document.getElementById('suggestedNameserver').addEventListener('click', () => {
            if (this.suggested) {
              this.suggested.forEach((suggestion, idx) => {
                document.getElementById(`nameserver${idx}`).value = suggestion;
              });
              Toast.fire({
                type: 'info',
                title: 'Suggested nameservers are shown in the nameservers textboxes. Click submit to update nameservers.',
              });
            }
          });
        }
      });
    },
    updateNameservers() {
      // Handle update nameservers form submission
    },
    saveNameservers() {
      // Handle save nameservers form submission
    },
    confirmDeleteDialog(domain_id, nameserver_id) {
      Swal.fire({
        type: "error",
        title: '<h3>Delete nameserver</h3>',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: 'Yes, Delete it',
        html:
          "<p>Your about to delete your domain nameserver </p>" +
          "<p>Are you sure want to delete it?</p>",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `view_domain?id=${domain_id}&link=nameservers&delete_registered=${nameserver_id}`;
        }
      });
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title text-lg mt-1">
        <i class="m-0">
          <svg style="width: 40px; height: 40px;">
            <use xlink:href="/images/myadmin/MyAdmin-Icons.min.svg#icon-dns"></use>
          </svg>
        </i>
        Domain Name Servers
      </h3>
      <div class="card-tools mr-4 mt-2">
        <a href="view_domain?id={{ id }}" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back">
          <i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
        </a>
      </div>
    </div>
    <div class="card-body">
      <div class="row justify-content-around">
        <div class="card form-gray col-md-6">
          <div class="card-header border-0">
            <h3 class="card-title text-lg"> Nameservers</h3>
            <div class="card-tools">
              <button v-if="suggested && suggested.length" type="button" class="btn btn-sm bg-gradient-info" id="suggestedNameserver" @click="handleSuggestedNameserver">
                Suggested Nameserver
              </button>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateNameservers" method="post" :action="`view_domain?id=${domain_id}&link=nameservers`">
              <input type="hidden" name="csrf_token" :value="csrf_token">
              <input type="hidden" name="action" value="add">
              <div v-for="foo in 3" :key="foo" class="form-group row">
                <label class="col-md-3 col-form-label" :for="`nameserver${foo}`">Nameserver #{{ foo + 1 }}</label>
                <div class="col-sm-9 input-group">
                  <input type="text" class="form-control form-control-sm" :id="`nameserver${foo}`" :name="`nameserver[${foo}]`" :value="nameservers[foo]?.name || ''">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-3 col-form-label" for="submit"></label>
                <div class="col-sm-9 input-group input-group-sm">
                  <input type="submit" name="ex_nameservers" value="Update" class="btn btn-custom btn-sm py-1 px-2" id="button-id-signup" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="card form-gray col-md-5">
          <div class="card-header border-0">
            <h3 class="card-title text-lg"> Register New Nameservers</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveNameservers" method="post" :action="`view_domain?id=${domain_id}&link=nameservers`">
              <input type="hidden" name="csrf_token" :value="csrf_token1">
              <div class="form-group row">
                <label class="col-md-3 col-form-label" for="name">Hostname</label>
                <div class="col-sm-9 input-group">
                  <input type="text" class="form-control form-control-sm" name="name" value="">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-3 col-form-label" for="ipaddress">IP Address</label>
                <div class="col-sm-9 input-group">
                  <input type="text" class="form-control form-control-sm" name="ipaddress" value="">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-md-3 col-form-label" for="submit"></label>
                <div class="col-sm-9 input-group input-group-sm">
                  <input type="submit" name="new_nameservers" value="Save" class="btn btn-outline-custom btn-sm py-1" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-if="registered_nameservers && registered_nameservers.length">
        <h4>Registered Nameservers</h4>
        <div class="row">
          <div class="col-md-8">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Hostname</th>
                  <th>IP Address</th>
                  <th>Can Delete</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ns, idx) in registered_nameservers" :key="idx">
                  <td>{{ ns.name }}</td>
                  <td>{{ ns.ipaddress }}</td>
                  <td>
                    <span :class="ns.can_delete == 1 ? 'text-green' : 'text-red'">{{ ns.can_delete == 1 ? 'Yes' : 'No' }}</span>
                  </td>
                  <td>
                    <a href="javascript:void(0);" title="Delete" data-toggle="tooltip" @click="confirmDeleteDialog(id, idx)">
                      <i class="fa fa-trash">&nbsp;</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>