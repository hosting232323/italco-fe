<template>
  <v-container>
    <h1>{{ role }} Dashboard</h1><hr>
    <DeliveryDashboard v-if="role === 'Delivery'" />
    <OperatorDashboard v-else-if="role === 'Operator'" />
    <CustomesDashboard v-else-if="role === 'Customer'" />
    <AdministrationDashboard v-else-if="role === 'Admin'" />
  </v-container>
</template>

<script setup>
import DeliveryDashboard from '@/components/delivery/Dashboard';
import OperatorDashboard from '@/components/operator/Dashboard';
import CustomesDashboard from '@/components/customers/Dashboard';
import AdministrationDashboard from '@/components/administration/Dashboard';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { role } = storeToRefs(userStore);
</script>
