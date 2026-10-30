<template>
  <v-container>
    <PageHeader title="Configurazione" />
    <CompanyConfigurationForm />
    <CompanyMailList />
    <!-- L'abbonamento esiste solo per le attività su cui il super admin ha acceso il pagamento automatico. -->
    <SubscriptionCard v-if="company?.automatic_payment" />
  </v-container>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import CompanyMailList from '@/components/configuration/CompanyMailList';
import SubscriptionCard from '@/components/configuration/SubscriptionCard';
import CompanyConfigurationForm from '@/components/configuration/CompanyConfigurationForm';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const { company } = storeToRefs(useUserStore());
</script>
