<template>
  <SelectionTable
    :ready="ready"
    :items="companies"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Modulo RAEE', key: 'rae', sortable: false },
      { title: 'Pianificazione automatica', key: 'automatic_planning', sortable: false },
      { title: 'Pagamento automatico', key: 'automatic_payment', sortable: false }
    ]"
    fill
  >
    <template #[`item.rae`]="{ item }">
      <v-icon
        :icon="item.rae ? 'mdi-check-circle' : 'mdi-close-circle'"
        :color="item.rae ? 'success' : 'grey'"
      />
    </template>
    <template #[`item.automatic_planning`]="{ item }">
      <v-icon
        :icon="item.automatic_planning ? 'mdi-check-circle' : 'mdi-close-circle'"
        :color="item.automatic_planning ? 'success' : 'grey'"
      />
    </template>
    <template #[`item.automatic_payment`]="{ item }">
      <v-icon
        :icon="item.automatic_payment ? 'mdi-check-circle' : 'mdi-close-circle'"
        :color="item.automatic_payment ? 'success' : 'grey'"
      />
    </template>
    <template #actions="{ item }">
      <v-btn
        variant="text"
        :loading="selectLoading[item.id]"
        :prepend-icon="item.id == activeCompany?.id ? 'mdi-check-circle' : 'mdi-login-variant'"
        :text="item.id == activeCompany?.id ? 'Selezionata' : 'Opera come'"
        @click="selectItem(item)"
      />
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        prepend-icon="mdi-recycle"
        text="Luoghi di smaltimento RAEE"
        variant="text"
        title="Luoghi di smaltimento RAEE"
        @click="openDisposalPlaces(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const router = useRouter();
const selectLoading = reactive({});

const companyStore = useCompanyStore();
const { element: company, activeForm, ready } = storeToRefs(companyStore);
const { company: activeCompany } = storeToRefs(useUserStore());

const companies = storesUtils.getStoreList(companyStore);

const disposalPlaceStore = useCompanyRaeDisposalPlaceStore();

const openForm = (item) => {
  company.value = { ...item };
  activeForm.value = true;
};

// Popup a parte, non dentro il form di modifica: gestire i luoghi è una
// responsabilità diversa dal modificare i dati della company, e va tenuta
// disponibile a prescindere dal fatto che il modulo RAEE sia già acceso.
const openDisposalPlaces = (item) => {
  disposalPlaceStore.open(item.id);
};

const selectItem = (item) => {
  selectLoading[item.id] = true;
  companyStore.selectElement(item, (data) => {
    selectLoading[item.id] = false;
    if (data.status == 'ok') router.push('/dashboard');
  });
};
</script>
