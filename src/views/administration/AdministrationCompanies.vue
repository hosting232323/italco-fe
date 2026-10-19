<template>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <template #activator>
      <v-container class="table-page">
        <PageHeader title="Gestione Company">
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuova company"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm"
          />
        </PageHeader>
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
import PageHeader from '@/components/PageHeader';
import CompanyForm from '@/components/administration/company/CompanyForm';
import CompanyTable from '@/components/administration/company/CompanyTable';
import RaeDisposalPlaceDialog from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceDialog';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const theme = useTheme();
const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const { dialogOpen: disposalPlacesOpen } = storeToRefs(useCompanyRaeDisposalPlaceStore());

const openForm = () => {
  company.value = {};
  activeForm.value = true;
};
</script>
