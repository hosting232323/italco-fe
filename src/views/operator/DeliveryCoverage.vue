<template>
  <v-container>
    <h1>Copertura corrieri</h1><hr>
    <p class="text-medium-emphasis my-3">
      Schedulazione settimanale della copertura: per ogni giorno della settimana uno o più blocchi, ciascuno con
      i CAP coperti, il veicolo assegnato e la fascia oraria.
    </p>

    <v-skeleton-loader
      v-if="!ready"
      type="card, table"
      :color="theme.current.value.secondaryColor"
    />
    <template v-else>
      <CoverageCalendar :entries="entries" />

      <h2 class="mt-8">
        Blocchi di copertura
        <v-btn
          icon="mdi-plus"
          style="float: right;"
          variant="text"
          @click="openEntryForm"
        />
      </h2><hr>
      <CoverageEntryForm />
      <CoverageEntryTable />
    </template>
  </v-container>
</template>

<script setup>
import CoverageCalendar from '@/components/operator/deliveryCoverage/CoverageCalendar';
import CoverageEntryForm from '@/components/operator/deliveryCoverage/CoverageEntryForm';
import CoverageEntryTable from '@/components/operator/deliveryCoverage/CoverageEntryTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();

const store = useDeliveryCoverageStore();
const { ready, entries, element, entryForm } = storeToRefs(store);

store.initList();

const openEntryForm = () => {
  element.value = { caps: [] };
  entryForm.value = true;
};
</script>
