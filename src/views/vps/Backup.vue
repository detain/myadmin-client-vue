<script setup lang="ts">
import { fetchWrapper } from '../../helpers/fetchWrapper';
import { moduleLink } from '../../helpers/moduleLink';
import { RouterLink } from 'vue-router';
import { ref, computed } from 'vue';
import { useSiteStore } from '../../stores/site.store';

const props = defineProps(['id', 'module']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();

const module_name = ref('');
const backup = ref('');
const hostname = ref('');
const confirm = ref(false);
const note_text = ref('');
const backupsArr = ref([]);
const id = computed(() => {
    return props.id;
});
const module = computed(() => {
    return props.module;
});

function submitForm() {
    // Handle form submission
    // You can access the form data using `module_name`, `module`, etc.
}
</script>

<template>
    <div>
        <div class="callout callout-info">
            <h5 class="text-red"><i class="fa fa-exclamation"></i> Important Note</h5>
            <p class="text-md">Backups will only work with default partitioning.</p>
        </div>
        <div class="row justify-content-center">
            <div class="col-6">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>{{ module_name }} Backup</h3>
                        <div class="card-tools text-right">
                            <router-link :to="'/' + moduleLink(module) + '/' + props.id" class="btn btn-custom btn-sm" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left">&nbsp;</i>&nbsp;Back&nbsp;&nbsp;</router-link>
                        </div>
                    </div>
                    <div class="card-body mb-0">
                        <form @submit.prevent="submitForm">
                            <input type="hidden" name="link" value="queue" />
                            <input type="hidden" name="action" value="backup" />
                            <input type="hidden" name="backup" :value="backup" />
                            <div class="form-group mb-0">
                                <div class="form-group row">
                                    <label class="col-md-3 col-form-label" for="hostname">Server</label>
                                    <div class="col-sm-6 input-group">
                                        <input id="hostname" type="text" class="form-control form-control-sm" name="hostname" :value="hostname" disabled />
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div class="icheck-success d-inline">
                                        <input id="confirm_yes" v-model="confirm" type="checkbox" class="form-check-input" name="confirm" value="yes" />
                                        <label class="more-info" for="confirm_yes">Do you really want to take backup?</label>
                                    </div>
                                </div>
                                <hr />
                                <div class="row justify-content-center">
                                    <div class="controls">
                                        <input type="submit" name="submit" value="Continue" class="btn btn-order px-4 py-2 text-sm" :disabled="!confirm" />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <hr />
                        <p class="text-muted text-xs"><b>Note: </b>{{ note_text }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2"><i class="material-icons pr-2" style="vertical-align: middle">backup</i>Current Backups</h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse">
                                    <i class="fas fa-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <template v-if="backupsArr.length > 0">
                            <table class="table-sm table">
                                <tr v-for="backup in backupsArr" :key="backup">
                                    <td>{{ backup }}</td>
                                </tr>
                            </table>
                        </template>
                        <template v-else> No backup currently exists </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
