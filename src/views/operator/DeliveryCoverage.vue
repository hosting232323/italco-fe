<template>
  <v-container>
    <h1>Copertura corrieri</h1><hr>
    <p class="text-medium-emphasis my-3">
      Giorni lavorativi dei corrieri: la copertura fissa definisce il periodo e i giorni della settimana
      con orario, le assenze specifiche ritagliano i giorni non lavorati.
    </p>

    <v-skeleton-loader
      v-if="!ready"
      type="card, table"
      :color="theme.current.value.secondaryColor"
    />
    <template v-else>
      <CoverageCalendar
        :delivery-users="deliveryUsers"
        :coverages="coverages"
        :absences="absences"
      />

      <h2 class="mt-8">
        Copertura fissa
        <v-btn
          icon="mdi-plus"
          style="float: right;"
          variant="text"
          @click="openCoverageForm"
        />
      </h2><hr>
      <CoverageForm />
      <CoverageTable @manage-days="openDays" />

      <h2 class="mt-8">
        Assenze specifiche
        <v-btn
          icon="mdi-plus"
          style="float: right;"
          variant="text"
          @click="openAbsenceForm"
        />
      </h2><hr>
      <AbsenceForm />
      <AbsenceTable />
    </template>
  </v-container>

  <v-dialog
    v-model="daysDialog"
    max-width="900"
  >
    <CoverageDayPopUp />
  </v-dialog>
</template>

<script setup>
import CoverageCalendar from '@/components/operator/deliveryCoverage/CoverageCalendar';
import CoverageForm from '@/components/operator/deliveryCoverage/CoverageForm';
import CoverageTable from '@/components/operator/deliveryCoverage/CoverageTable';
import CoverageDayPopUp from '@/components/operator/deliveryCoverage/CoverageDayPopUp';
import AbsenceForm from '@/components/operator/deliveryCoverage/AbsenceForm';
import AbsenceTable from '@/components/operator/deliveryCoverage/AbsenceTable';

import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const daysDialog = ref(false);

const store = useDeliveryCoverageStore();
const {
  ready, deliveryUsers, coverages, absences, element, managedCoverage, coverageForm, absenceForm
} = storeToRefs(store);

store.initList();

// Chiuso il popup, si lascia andare la copertura gestita.
watch(daysDialog, (open) => {
  if (!open) managedCoverage.value = null;
});

const openCoverageForm = () => {
  element.value = {};
  coverageForm.value = true;
};

const openAbsenceForm = () => {
  element.value = {};
  absenceForm.value = true;
};

const openDays = (coverage) => {
  managedCoverage.value = coverage;
  daysDialog.value = true;
};
</script>
