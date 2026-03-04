<script setup lang="ts">
import { fetchWrapper } from '@/helpers/fetchWrapper';
import { moduleLink } from '@/helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { watch, ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores/site.store';
import myAdminIcons from '@/assets/images/myadmin/MyAdmin-Icons.min.svg';
import Swal from 'sweetalert2';
const props = defineProps<{
    id: number;
    nameservers: NameServerRow[] | undefined;
}>();
const siteStore = useSiteStore();
const baseUrl = siteStore.getBaseUrl();
const module = 'domains';
const id = computed(() => props.id);
const nameservers = computed(() => props.nameservers);
const suggested = ref<string[]>([]);
const registeredNameservers = ref<RegNameServerRow[]>([]);
const iconHref = (name: string) => `${myAdminIcons}#icon-${name}`;
const nameserverInputs = ref<string[]>(buildInitialNameservers(nameservers.value));
const newNameserver = ref({
    name: '',
    ipaddress: '',
});

interface NameServerRow {
    sortorder: string;
    name: string;
    ipaddress: string;
}

interface RegNameServerRow {
    name: string;
    ipaddress: string;
    can_delete: '1' | '0';
}

onMounted(() => {});

watch(
    () => nameservers,
    (nameservers) => {
        nameserverInputs.value = buildInitialNameservers(nameservers.value);
    }
);

function buildInitialNameservers(nameservers: NameServerRow[] | undefined): string[] {
    const result = typeof nameservers == 'undefined' ? [] : nameservers.map((ns) => ns.name).slice(0, 4);
    while (result.length < 4) {
        result.push('');
    }
    return result as string[];
}

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
            .put(`${baseUrl}/${moduleLink(module)}/${id.value}/nameservers`, {
                nameserver: nameserverInputs.value,
            })
            .then((response) => {
                Swal.close();
                console.log('update nameservers success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response.text}`,
                });
            });
    } catch (error: any) {
        Swal.close();
        console.log('update nameservers failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error.text}`,
        });
    }
}

function registerNameserver() {
    try {
        fetchWrapper
            .post(`${baseUrl}/${moduleLink(module)}/${id.value}/nameservers`, {
                name: newNameserver.value.name,
                ipAddress: newNameserver.value.ipaddress,
            })
            .then((response) => {
                Swal.close();
                console.log('register nameserver success', response);
                Swal.fire({
                    icon: 'success',
                    html: `Success${response}`,
                });
                loadNameservers();
            });
    } catch (error: any) {
        Swal.close();
        console.log('register nameserver failed', error);
        Swal.fire({
            icon: 'error',
            html: `Got error ${error}`,
        });
    }
}

function confirmDelete(name: string, ip: string) {
    Swal.fire({
        icon: 'error',
        title: 'Delete nameserver',
        html: `<p>You are about to delete your domain nameserver.</p><br><p>Are you sure?</p>`,
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it',
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                fetchWrapper.delete(`${baseUrl}/${moduleLink(module)}/${id.value}/nameservers?name=${name}&ip=${ip}`).then((response) => {
                    Swal.close();
                    console.log('delete nameserver success', response);
                    Swal.fire({
                        icon: 'success',
                        html: `Success${response}`,
                    });
                    loadNameservers();
                });
            } catch (error: any) {
                Swal.close();
                console.log('delete  nameserver failed', error);
                Swal.fire({
                    icon: 'error',
                    html: `Got error ${error}`,
                });
            }
        }
    });
}

const loadNameservers = async () => {
    try {
        const response = await fetchWrapper.get(`${baseUrl}/${moduleLink(module)}/${id.value}/nameservers`);
        console.log('api success', response);
        registeredNameservers.value = response;
    } catch (error: any) {
        console.log('api failed', error);
    }
};

loadNameservers();
</script>

<template>
    <div class="card">
        <!-- HEADER -->
        <div class="card-header">
            <h3 class="card-title text-lg mt-1">
                <i class="icon-dns m-0 pull-left" style="width: 40px; height: 40px">
                    <svg><use :href="iconHref('dns')" /></svg></i
                >Domain Name Servers
            </h3>
            <div class="card-tools mr-4 mt-2">
                <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;</router-link>
            </div>
        </div>
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
                                        <span :class="ns.can_delete == '1' ? 'text-green' : 'text-red'">{{ ns.can_delete == '1' ? 'Yes' : 'No' }}</span>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" title="Delete" @click.prevent="confirmDelete(ns.name, ns.ipaddress)"><i class="fa fa-trash-o"></i></a>
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
