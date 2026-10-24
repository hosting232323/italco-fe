<template>
  <v-card
    v-if="dialogOpen"
    :title="`Luoghi di smaltimento RAEE — ${companyName}`"
  >
    <v-card-text>
      <!-- Il modulo RAEE si accende dalla tabella, ma solo con almeno un luogo
      (e con l'iscrizione all'Albo, che inserisce l'admin dalla configurazione):
      i luoghi si preparano qui, prima, quindi la gestione è sempre disponibile. -->
      <div class="text-right mb-2">
        <v-btn
          prepend-icon="mdi-plus"
          text="Crea nuovo luogo"
          variant="text"
          :color="theme.current.value.primaryColor"
          @click="openForm"
        />
      </div>
      <RaeDisposalPlaceForm />
      <RaeDisposalPlaceTable />
    </v-card-text>
  </v-card>
</template>

<script setup>
import RaeDisposalPlaceTable from './RaeDisposalPlaceTable';
import RaeDisposalPlaceForm from './RaeDisposalPlaceForm';

import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const theme = useTheme();

const companyStore = useCompanyStore();
const { list: companies } = storeToRefs(companyStore);

const store = useCompanyRaeDisposalPlaceStore();
const { dialogOpen, companyId, element: place, activeForm } = storeToRefs(store);

const company = computed(() => companies.value?.find((item) => item.id == companyId.value));
const companyName = computed(() => company.value?.name ?? companyId.value);

const openForm = () => {
  place.value = {};
  activeForm.value = true;
};
</script>
