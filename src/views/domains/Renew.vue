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

export default {
  data() {
    return {
      renewCost: "{$formValues.renewCost}",
      whoisCost: "{$formValues.whoisCost}",
      formValues: {
        serviceInfo: {
          domain_hostname: "{$formValues.serviceInfo.domain_hostname}",
        },
        expireDate: "{if !is_null($formValues.expireDate)}{$formValues.expireDate}{/if}",
        domain_id: "{$formValues.domain_id}",
      },
      tldInfo: {
        tld_grace_period: "{$tldInfo.tld_grace_period}",
        tld_whois_privacy_available: "{$tldInfo.tld_whois_privacy_available}",
      },
      whoisPrivacy: "{$whoisPrivacy}",
      currencySymbol: "{$currencySymbol}",
      csrfToken: "{$csrf_token}",
    };
  },
  computed: {
    renewCostFormatted() {
      return parseFloat(this.renewCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    whoisCostFormatted() {
      return parseFloat(this.whoisCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  methods: {
    placeOrder() {
      // Handle form submission
    },
    renewCalculate() {
      // Calculate renew cost
    },
  },
};
</script>

<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card shadow-none w-100 bg-white p-2 mb-2" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
        <p class="m-0 text-md">
          <i class="fas fa-lightbulb" style="color: greenyellow;"></i>&nbsp;<b>Tip #1:</b>&nbsp;Domain should be renewed on or before expiry date.
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="remove">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </p>
      </div>
      <div class="card shadow-none w-100 bg-white p-2 mb-2" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
        <p class="m-0 text-md">
          <i class="fas fa-lightbulb" style="color: greenyellow;"></i>&nbsp;<b>Tip #2:</b>&nbsp;If domain expired and have grace period of <b>{{ tldInfo.tld_grace_period }} days</b> from expiry date to renew.
          <div class="card-tools float-right">
            <button type="button" class="btn btn-tool" data-card-widget="remove">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </p>
      </div>
      <template v-if="tldInfo.tld_whois_privacy_available == 'Y'">
        <div class="card shadow-none w-100 bg-white p-2 mb-2" :style="{ 'border-left': '4px solid greenyellow', display: 'block ruby' }">
          <p class="m-0 text-md">
            <i class="fas fa-lightbulb" style="color: greenyellow;"></i>&nbsp;<b>Tip #3:</b>&nbsp;Enable <b>Whois Privacy</b> to hide your Contact Information when a user does a WHOIS lookup on that Registrant’s domain.
            <div class="card-tools float-right">
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </p>
        </div>
      </template>
    </div>
  </div>
  <div class="row justify-content-center mt-3">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title text-lg"><i class="fas fa-address-card">&nbsp;</i>Renew</h3>
          <div class="card-tools m-0">
            <a href="view_domain?id={{ id }}" class="btn-outline-custom py-1 px-2" data-toggle="tooltip" title="Go Back">
              <i class="fas fa-arrow-left text-sm"></i>&nbsp;Back
            </a>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="placeOrder">
            <input type="hidden" name="csrf_token" :value="csrfToken">
            <div class="form-group row">
              <label class="col-md-3 col-form-label" for="domain">Domain</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="hostname" name="domain" :value="formValues.serviceInfo.domain_hostname" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label" for="expiry_date">Expiry Date</label>
              <div class="col-sm-9 input-group">
                <input type="text" class="form-control form-control-sm" id="expiry_date" name="expiry_date" :value="formValues.expireDate || ''" disabled>
              </div>
            </div>
            <template v-if="tldInfo.tld_whois_privacy_available == 'Y'">
              <div class="form-group row">
                <label class="col-md-3 col-form-label" for="whois_privacy">Whois Privacy</label>
                <div class="col-sm-9 input-group">
                  <select name="whois_privacy" class="form-control form-control-sm select2bs4" dir="rtl" id="whois_privacy" @change="renewCalculate">
                    <option value="enable" :selected="whoisPrivacy === 'enabled'">Enable</option>
                    <option value="disable" :selected="!whoisPrivacy || whoisPrivacy === 'disabled' || whoisPrivacy === '' || whoisPrivacy === false">Disable</option>
                  </select>
                </div>
              </div>
            </template>
            <div class="form-group row">
              <label class="col-md-3 col-form-label" for="renew_cost">Renew Cost</label>
              <div class="col-sm-9 input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                </div>
                <input type="text" class="form-control form-control-sm" id="renew_cost" name="renew_cost" :value="renewCostFormatted" disabled>
              </div>
            </div>
            <div id="whois_row" class="form-group row">
              <label class="col-md-3 col-form-label" for="whois_cost">Whois Cost</label>
              <div class="col-sm-9 input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                </div>
                <input type="text" class="form-control form-control-sm" id="whois_cost" name="whois_cost" :value="whoisCostFormatted" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label" for="total_cost">Total Cost</label>
              <div class="col-sm-9 input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                </div>
                <input type="text" class="form-control" id="total_cost" name="total_cost" :value="renewCostFormatted" disabled>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-3 col-form-label" for="submit"></label>
              <div class="col-sm-9 input-group input-group-sm">
                <input type="submit" name="Submit" value="Place Order" class="btn btn-custom btn-sm py-2" />
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