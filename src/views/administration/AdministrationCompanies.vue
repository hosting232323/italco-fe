<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-container>
        <h1>
          Gestione Company
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
          />
        </h1><hr>
        <p class="mt-2 mb-4">
          Seleziona la company su cui operare: da quel momento in poi vedi e
          modifichi soltanto i suoi dati.
        </p>
        <CompanyForm />
        <CompanyTable :activator-props="activatorProps" />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
import CompanyForm from '@/components/administration/company/CompanyForm';
import CompanyTable from '@/components/administration/company/CompanyTable';

import { storeToRefs } from 'pinia';
import { useCompanyStore } from '@/stores/company';

const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const openForm = () => {
  company.value = {};
  activeForm.value = true;
};
</script>
