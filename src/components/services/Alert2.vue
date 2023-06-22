<script setup>
import { ref } from 'vue';

import BuyIp from '@components/alerts/BuyIp.vue';
import CancelDomain from '@components/alerts/CancelDomain.vue';
import CancelLicense from '@components/alerts/CancelLicense.vue';
import CancelMail from '@components/alerts/CancelMail.vue';
import CancelQs from '@components/alerts/CancelQs.vue';
import CancelSsl from '@components/alerts/CancelSsl.vue';
import CancelStorage from '@components/alerts/CancelStorage.vue';
import CancelVps from '@components/alerts/CancelVps.vue';
import CancelWebsite from '@components/alerts/CancelWebsite.vue';
import Confirm from '@components/alerts/Confirm.vue';
//import EppCode from '@components/alerts/EppCode.vue';
//import Lock from '@components/alerts/Lock.vue';
//import Whois from '@components/alerts/Whois.vue';

const display = ref('yes');
const action = ref('eppcode');
const actions = ref([
  //'eppcode',
  //'lock',
  'cancel_domain',
  'cancel_vps',
  'cancel_website',
  'cancel_qs',
  'cancel_storage',
  'cancel_license',
  'cancel_mail',
  'cancel_ssl',
  //'whois',
  'buy_ip',
  'confirm',
]);

const getComponent = (action) => {
  switch (action) {
    case 'eppcode':
      return 'EppCode';
    case 'lock':
      return 'Lock';
    case 'cancel_domain':
      return 'CancelDomain';
    case 'cancel_vps':
      return 'CancelVps';
    case 'cancel_website':
      return 'CancelWebsite';
    case 'cancel_qs':
      return 'CancelQs';
    case 'cancel_storage':
      return 'CancelStorage';
    case 'cancel_license':
      return 'CancelLicense';
    case 'cancel_mail':
      return 'CancelMail';
    case 'cancel_ssl':
      return 'CancelSsl';
    case 'whois':
      return 'Whois';
    case 'buy_ip':
      return 'BuyIp';
    case 'confirm':
      return 'Confirm';
    default:
      return null;
  }
};

const getData = (action) => {
  // Implement the logic to get and return the appropriate data
  // based on the action
  // You can define and return an object with the required variables
  // for each component

  // Example:
  switch (action) {
    case 'eppcode':
      return { domain: 'example.com' };
    case 'lock':
      return { domain: 'example.com' };
    case 'cancel_domain':
      return { domain: 'example.com' };
    case 'cancel_vps':
      return { vpsId: 123 };
    case 'cancel_website':
      return { websiteId: 456 };
    case 'cancel_qs':
      return { qsId: 789 };
    case 'cancel_storage':
      return { storageId: 987 };
    case 'cancel_license':
      return { licenseId: 654 };
    case 'cancel_mail':
      return { username: 'example' };
    case 'cancel_ssl':
      return { orderId: 321 };
    case 'whois':
      return { domain: 'example.com' };
    case 'buy_ip':
      return { domain: 'example.com' };
    case 'confirm':
      return { url: 'example.com', html: '<p>Confirmation message</p>' };
    default:
      return null;
  }
};

</script>

<template>
 <div>
    <template v-if="display === 'yes' && actions.includes(action)">
      <component :is="getComponent(action)" :data="getData(action)" />
    </template>
  </div>
</template>

<style scoped>
</style>
