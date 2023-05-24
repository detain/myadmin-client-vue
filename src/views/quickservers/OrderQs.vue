<script setup>
import { ref, computed } from 'vue'
import Swal from 'sweetalert2';
import { useLayoutStore } from '@/stores';
const layoutStore = useLayoutStore();
layoutStore.setPageHeading('Order Rapid Deploy Server');
layoutStore.setTitle('Order Rapid Deploy Server');
layoutStore.setBreadcrums({'/home': 'Home', '/qs': 'Rapid Deploy Servers List', '/qs/order': 'Order Rapid Deploy Server'});

const step = ref("orderform");
const currency = ref("USD");
const currencySymbol = ref("$");
const custid = ref(2773);
const ima = ref("client");
const qsId = ref("383");
const serverDetails = ref({
    383: {
        cpu: "Intel(R) Xeon(R) CPU E3-1270 V2 @ 3.50GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$49.00"
    },
    384: {
        cpu: "Intel(R) Xeon(R) CPU E3-1270 V2 @ 3.50GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$49.00"
    },
    386: {
        cpu: "Intel(R) Xeon(R) CPU E3-1270 V2 @ 3.50GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$49.00"
    },
    387: {
        cpu: "Intel(R) Xeon(R) CPU E3-1270 V2 @ 3.50GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$49.00"
    },
    385: {
        cpu: "Intel(R) Xeon(R) CPU E3-1230 v3 @ 3.30GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$54.00"
    },
    235: {
        cpu: "Intel(R) Xeon(R) CPU E3-1230 V2 @ 3.30GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$60.00"
    },
    377: {
        cpu: "Intel(R) Xeon(R) CPU E3-1230 v5 @ 3.40GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$79.00"
    },
    378: {
        cpu: "Intel(R) Xeon(R) CPU E3-1230 v5 @ 3.40GHz",
        ram: "30GB",
        hd: "1760GB",
        cores: "8",
        cost: "$79.00"
    },
    374: {
        cpu: "Intel(R) Xeon(R) CPU E5-1620 v4 @ 3.50GHz",
        ram: "60GB",
        hd: "3632GB",
        cores: "8",
        cost: "$130.00"
    }
});
const version = ref({ "centosstream-8": "8 Stream (64 bits)", "centos-7.7": "7.7 (64 bits)"
});
const distroSel = ref({
    Almalinux: "Almalinux",
    CentOS: "CentOS",
    Debian: "Debian",
    Fedora: "Fedora",
    FreePBX: "FreePBX", "Empty Disk": "Empty Disk",
    OpenSUSE: "OpenSUSE",
    Ubuntu: "Ubuntu"
});
const rootpass = ref("KcmGt%b8");
const csrfToken = ref( "7892f61c1ce4897a5a418b2cd40cb869f4657c2c430fe3ca06045a8a101b3abf05957ca65d6e727b6cb85c9222ed771432aeec2860837049fc070c5609e22122");
</script>

<template>
    <template v-if="!step || step == 'orderform'">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-server" aria-hidden="true">&nbsp;</i>Order Rapid Deploy Server
                            </h3>
                            <div class="card-tools float-right">
                                <a href="view_quickservers_list" class="btn btn-custom btn-sm mt-0" data-toggle="tooltip" title="Go Back"><i class="fa fa-arrow-left"></i>&nbsp;&nbsp;Back&nbsp;&nbsp;
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form id="quickserver_form" method="post" class="quickserver_form_init" @submit.prevent="submitForm">
                            <input type="hidden" name="csrf_token" :value="csrfToken">
                            <input type="hidden" name="rootpass" v-model="rootpass">
                            <div class="form-group row">
                                <div class="col-md-12">
                                    <table v-if="Object.keys(serverDetails).length > 0" class="table table-sm text-center">
                                        <tbody>
                                            <tr>
                                                <th>Select Server</th>
                                                <th>QS NO.</th>
                                                <th>QUICKSERVER</th>
                                                <th>RAM</th>
                                                <th>HDD</th>
                                                <th>CORES</th>
                                            </tr>
                                            <tr v-for="(details, value) in serverDetails" :key="value">
                                                <td>
                                                    <div class="icheck-success d-inline">
                                                        <input :id="'qs-' + value" type="radio" class="form-check-input" name="quickserver" :value="value" :checked="qsId === value" @change="updatePrice" />
                                                        <label class="text-bold my-1" :for="'qs-' + value">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>{{ value }}</td>
                                                <td>{{ details.cpu }}</td>
                                                <td>{{ details.ram }}</td>
                                                <td>{{ details.hd }}</td>
                                                <td>{{ details.cores }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div v-else>
                                        <input type="text" class="form-control form-control-sm text-bold text-xs" value="Currently sold out!" disabled>
                                        <small class="text-xs text-muted">
                                            <a class="link" target="__blank" href='https://www.interserver.net/dedicated/rapid-deploy.html'>
                                                Please contact our sales department.
                                            </a>
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">Operating System</label>
                                <div class="form-group input-group col-md-9">
                                    <select id="distro" name="distro" class="form-control form-control-sm select2" @change="vpsUpdate">
                                        <option v-for="(d2, d1) in distroSel" :value="d1">{{ d2 }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">Version</label>
                                <div class="input-group col-md-9">
                                    <select id="os" name="os" class="form-control form-control-sm select2">
                                        <option v-for="(v1, val) in version" :value="val">{{ v1 }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label class="col-md-3 col-form-label">Root Password</label>
                                <input type="password" class="form-control form-control-sm" name="rootpass" id="mypassword" placeholder="Root Password" v-model="rootpass" />
                                <small class="form-text text-muted">
                                    Note: Password must contain atleast 8 characters, one lowercase letter, one uppercase letter, one number, a special character.
                                </small>
                            </div>
                            <div class="form-group row">
                                <div class="controls col-md-12 text-center"><input type="submit" name="Submit" value="Continue" class="btn btn-sm btn-order px-3 py-2">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <!-- Order Summary -->
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div id="package_name" class="col-md-8">Rapid Deploy Server</div>
                            <div id="package_period" class="col text-right text-bold">1 Month(s)</div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">Package Cost</div>
                            <div class="col text-bold text-right package_cost"></div>
                        </div>
                        <hr>
                        <div class="row mb-3">
                            <div class="col-md-8 text-lg">Total</div>
                            <div id="totalcost" class="col text-lg text-bold text-right total_cost"></div>
                        </div>
                    </div>
                </div>
                <!-- End Order Summary -->
            </div>
        </div>
    </template>
    <template v-else-if="step == 'order_confirm'">
        <div class="row justify-content-center">
            <div class="col-md-7">
                <div class="card">
                    <div class="card-header">
                        <div class="p-1">
                            <h3 class="card-title py-2">
                                <i class="fa fa-shopping-cart" aria-hidden="true">&nbsp;</i>Order Summary
                            </h3>
                            <div class="card-tools float-right">
                                <button type="button" class="btn btn-tool mt-0" data-card-widget="collapse"><i class="fas fa-minus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <form method="post" id="edit_order_form" :action="orderUrl">
                            <input type="hidden" name="csrf_token" :value="csrfToken" />
                            <input v-for="(value, field) in orderData" :key="field" :id="field" type="hidden" :name="field" :value="value" />
                        </form>
                        <form method="post" class="quickserver_form_confirm" :action="orderUrl">
                            <input type="hidden" name="csrf_token" :value="csrfToken" />
                            <input v-for="(value, field) in orderData" :key="field" :id="field" type="hidden" :name="field" :value="value" />
                            <table class="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="text-bold float-left" style="position:relative;top:5px;">Server Name</div>
                                            <button type="button" class="btn btn-custom btn-sm float-right" name="update_values" @click="editForm" data-toggle="tooltip" title="Edit details">
                                                <i class="fa fa-pencil"></i>&nbsp;Edit
                                            </button>
                                        </th>
                                        <th>
                                            <div class="text-bold">{{ serverDetails[qsId].cpu }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="text-sm">QuickServer ID</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ qsId }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">Operating System</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ distroSel[orderData.distro] }} {{ version[orderData.os] }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">RAM</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].ram }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">HDD</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].hd }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="text-sm">CORES</div>
                                        </td>
                                        <td>
                                            <div class="text-bold">{{ serverDetails[qsId].cores }}</div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>
                                            <div class="text-lg">Total</div>
                                        </th>
                                        <th>
                                            <div class="text-bold text-lg total_cost" id="totalprice"></div>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                            <hr>
                            <div class="p-1">
                                <h4 class="text-center"><u>Agree to the offer terms</u></h4>
                                <p class="text-center text-sm">The subscription will automatically renew after <b>every month at</b> <span id="totalprice" class="total_cost text-bold"></span> until canceled.</p>
                                <p class="text-muted text-xs">
                                    By checking this box, you acknowledge that you are purchasing a subscription product that automatically renews <br><b>( As Per The Terms Outlined Above )</b> and is billed to the credit card you provide today. If you wish to cancel your auto-renewal, you may access the customer portal <a href="https://my.interserver.net" target="__blank" class="link">(Here)</a> select the active service and click the <b>Cancel</b> link or email at: <a href="mailto:billing@interserver.net" class="link">billing@interserver.net</a> or use another method outlined in the <b>Terms and Conditions.</b> By checking the box and clicking Place My Order below, You also acknowledge you have read, understand, and agree to our <a class="link" href="https://www.interserver.net/terms-of-service.html" target="__blank">Terms and Conditions</a> and <a class="link" href="https://www.interserver.net/privacy-policy.html" target="__blank">Privacy Policy</a>.
                                </p>
                                <div class="icheck-success text-bold text-center"><input type="checkbox" name="tos" id="tos" style="margin: 0 5px; display: inline;" value="yes">
                                    <label for="tos" class="d-inline text-center">I have read the terms above and I agree.</label>
                                </div>
                            </div>
                            <div class="row">
                                <div class="controls col-md-12 text-center"><input type="submit" name="Submit" value="Place Order" class="btn btn-sm btn-green px-3 py-2">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>
<style scoped>
</style>