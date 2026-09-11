<template>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <template #activator>
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
        <CompanyTable />
      </v-container>
    </template>
    <template #default>
      <CompanyForm />
    </template>
  </v-dialog>
  <v-dialog
    v-model="disposalPlacesOpen"
    max-width="1200"
  >
    <RaeDisposalPlaceDialog />
  </v-dialog>
</template>

<script setup>
import CompanyForm from '@/components/administration/company/CompanyForm';
import CompanyTable from '@/components/administration/company/CompanyTable';
import RaeDisposalPlaceDialog from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceDialog';

import { storeToRefs } from 'pinia';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const { dialogOpen: disposalPlacesOpen } = storeToRefs(useCompanyRaeDisposalPlaceStore());

const openForm = () => {
  company.value = {};
  activeForm.value = true;
};
</script>
