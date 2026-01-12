<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '../../stores/site.store';
import iconDns from '../../assets/images/myadmin/dns.png';
import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'domains';
const id = computed(() => props.id);
const suggested = ref<string[]>([]);
const initialNameservers = ref<string[]>([]);
const nameservers = ref<Nameservers>([]);
const registeredNameservers = ref<Nameservers>([]);
onMounted(() => {});

type Nameservers = NameserverRow[];

interface NameserverRow {
    name: string;
    ipaddress: string;
    can_delete: number;
}

const nameserverInputs = ref<string[]>(initialNameservers.value.length ? [...initialNameservers.value] : ['', '', '', '']);
const newNameserver = ref({
    name: '',
    ipaddress: '',
});

function applySuggested() {
    suggested.value?.forEach((value, index) => {
        if (index < nameserverInputs.value.length) {
            nameserverInputs.value[index] = value;
        }
    });
    Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Suggested nameservers have been applied. Click Update to save.',
        position: 'top',
        showConfirmButton: false,
        timer: 5000,
    });
}

function submitNameservers() {
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/nameserver`, {
                name: newNameserver.value.name,
                ipAddress: newNameserver.value.ipaddress,
                new_nameservers: 1,
            })
            .then((response) => {
                Swal.close();
                console.log('register nameserver success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('register nameserver failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function registerNameserver() {
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/nameserver`, {
                name: newNameserver.value.name,
                ipAddress: newNameserver.value.ipaddress,
                new_nameservers: 1,
            })
            .then((response) => {
                Swal.close();
                console.log('register nameserver success');
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('register nameserver failed');
        console.log(error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function confirmDelete(index: number) {
    Swal.fire({
        icon: 'error',
        title: 'Delete nameserver',
        html: `
      <p>You are about to delete your domain nameserver.</p>
      <p>Are you sure?</p>
    `,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `view_domain?id=${id.value}&link=nameservers&delete_registered=${index}`;
        }
    });
}
</script>

<template>
    <div class="card">
        <!-- HEADER -->
        <div class="card-header">
            <h3 class="card-title text-lg mt-1">
                <i class="icon-dns m-0 pull-left" style="width: 40px; height: 40px"><img :src="iconDns" alt="DNS" /></i>Domain Name Servers
            </h3>

            <div class="card-tools mr-4 mt-2">
                <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
        </div>

        <!-- BODY -->
        <div class="card-body">
            <div class="row justify-content-around">
                <!-- NAMESERVERS -->
                <div class="card form-gray col-md-6">
                    <div class="card-header border-0">
                        <h3 class="card-title text-lg">Nameservers</h3>
                        <div v-if="suggested?.length" class="card-tools">
                            <button type="button" class="btn btn-sm bg-gradient-info" @click="applySuggested">Suggested Nameserver</button>
                        </div>
                    </div>

                    <div class="card-body">
                        <form @submit.prevent="submitNameservers">
                            <div v-for="(ns, index) in nameserverInputs" :key="index" class="form-group row">
                                <label class="col-md-3 col-form-label"> Nameserver #{{ index + 1 }} </label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="nameserverInputs[index]" type="text" class="form-control form-control-sm" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-9 offset-md-3">
                                    <button type="submit" class="btn btn-custom btn-sm py-1 px-2">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- REGISTER NEW NAMESERVER -->
                <div class="card form-gray col-md-5">
                    <div class="card-header border-0">
                        <h3 class="card-title text-lg">Register New Nameservers</h3>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="registerNameserver">
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">Hostname</label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="newNameserver.name" type="text" class="form-control form-control-sm" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">IP Address</label>
                                <div class="col-sm-9 input-group">
                                    <input v-model="newNameserver.ipaddress" type="text" class="form-control form-control-sm" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-9 offset-md-3">
                                    <button type="submit" class="btn btn-outline-custom btn-sm py-1">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- REGISTERED NAMESERVERS -->
            <div v-if="registeredNameservers?.length">
                <h4 class="mt-4">Registered Nameservers</h4>
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
                                <tr v-for="(ns, index) in registeredNameservers" :key="index">
                                    <td>{{ ns.name }}</td>
                                    <td>{{ ns.ipaddress }}</td>
                                    <td>
                                        <span :class="ns.can_delete ? 'text-green' : 'text-red'">{{ ns.can_delete ? 'Yes' : 'No' }}</span>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" title="Delete" @click="confirmDelete(index)"><i class="fa fa-trash-o"></i></a>
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
@import '../../assets/images/myadmin/css/styles.css';
</style>
