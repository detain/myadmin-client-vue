<script setup>
import { fetchWrapper } from '@/helpers';
import { RouterLink } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { useSiteStore } from '@/stores';
const props = defineProps(['id']);
const successMsg = ref('');
const cancelQueue = ref('');
const fields = ref({});
const siteStore = useSiteStore();
siteStore.setTitle('');
siteStore.setPageHeading('');
siteStore.setBreadcrums({ '/home': 'Home', '/domains': 'Domains' });
siteStore.addBreadcrum('/domains/' + props.id, 'View Domain ' + props.id);
siteStore.addBreadcrum('/domains/' + props.id + '/', '');

const currencySymbol = ref('$');
const whoisCost = ref(0);
const domain = ref('');
//const id = ref('');
const contactPrivacyCost = ref(5.0);
function placeOrder() {
  // Handle the form submission
  // ...
}
</script>

<template>
  <div class="row">
    <div class="col-md-12">
      <div class="w-100 b-radius mb-4 bg-white p-3" :style="{ 'border-left': '4px solid greenyellow' }">
        <p class="text-md m-0">
          <i class="fas fa-lightbulb" style="color: greenyellow"></i>&nbsp;<b>Note:</b> &nbsp;Whois Privacy gets renewed every <b>12 months</b> from the date of activation. Whois Privacy Addon renewal cost is <b>{{ currencySymbol }}{{ whoisCost.toFixed(2) }}</b
          >.
        </p>
      </div>
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card b-radius">
        <div class="card-header">
          <h3 class="card-title text-lg"><i class="fas fa-address-card">&nbsp;</i>Whois Privacy</h3>
          <div class="card-tools m-0">
            <router-link :to="'/domains/' + props.id" class="btn-outline-custom px-2 py-1" data-toggle="tooltip" title="Go Back"><i class="fas fa-arrow-left text-sm"></i>&nbsp;Back</router-link>
          </div>
        </div>
        <div class="card-body">
          <form @submit.prevent="placeOrder">
            <div class="form-group row">
              <label class="col-md-2 col-form-label" for="domain">Domain</label>
              <div class="col-sm-10 input-group">
                <input type="text" class="form-control form-control-sm" id="hostname" :value="domain" disabled />
              </div>
            </div>
            <div id="whois_row" class="form-group row">
              <label class="col-md-2 col-form-label" for="whois_cost">Whois Cost</label>
              <div class="col-sm-10 input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text font-weight-bold">{{ currencySymbol }}</span>
                </div>
                <input type="text" class="form-control form-control-sm" id="whois_cost" :value="whoisCost.toFixed(2)" disabled />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-md-2 col-form-label" for="submit"></label>
              <div class="col-sm-10 input-group input-group-sm">
                <input type="submit" name="Submit" value="Place Order" class="btn btn-custom btn-sm px-3 py-2 text-sm" id="button-id-signup" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title text-lg"><i class="fas fa-user-secret">&nbsp;</i>Contact Privacy</h4>
          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>
          </div>
        </div>
        <div class="card-body">
          <p>Contact Privacy hides the identity of a Registrant when a user does a WHOIS lookup on that Registrant’s domain.</p>
          <p>The benefit of having Contact Privacy is that the Registrant’s identity, including home address, phone number, and email address, is shielded from spammers, identity thieves and scammers.</p>
          <p>When Registrants enable the Contact Privacy service, masked contact information appears in the public WHOIS database.</p>
          <p>
            Contact privacy is available for <span class="text-md text-green text-md">{{ contactPrivacyCost }}</span> per domain per year.
          </p>
          <p>To enable Contact Privacy for your Domain, Place Order Now.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
