<template>
  <div v-if="isReady">
    <v-container>
      <h1>{{ role }}</h1><hr>
      <DeliveryDashboard v-if="role === 'Delivery'" />
      <OperatorDashboard v-else-if="role === 'Operator'" />
      <CustomesDashboard v-else-if="role === 'Customer'" />
      <AdministrationDashboard v-else-if="role === 'Admin'" />
    </v-container>
  </div>
  <div v-else>
    Caricamento...
  </div>
</template>

<script setup>
import DeliveryDashboard from '@/components/delivery/Dashboard';
import OperatorDashboard from '@/components/operator/Dashboard';
import CustomesDashboard from '@/components/customers/Dashboard';
import AdministrationDashboard from '@/components/administration/Dashboard';

import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { role } = storeToRefs(userStore);
const isReady = ref(false);

onMounted(() => {
  role.value = localStorage.getItem('user_role');
  isReady.value = true;
});
</script>
