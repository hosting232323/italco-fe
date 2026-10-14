<template>
  <div>
    <p class="text-medium-emphasis my-3">
      Tutti i vincoli che regolano quando e quanto si può ordinare e come vengono composti i borderò, in un
      unico posto.
    </p>

    <h2>
      Limiti per area geografica
      <v-btn
        v-if="isAdmin"
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openGeographicZoneForm"
      />
    </h2><hr>
    <p class="text-medium-emphasis my-3">
      Numero massimo di ordini per giorno della settimana in ogni area. Se per un'area non è configurato nulla,
      i punti vendita non potranno effettuare ordini per i clienti di quella zona.
    </p>
    <GeographicZoneTable @open-pop-up="openPopUp" />

    <h2 class="mt-8">
      Limiti per punto vendita
      <v-btn
        v-if="isAdmin"
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openCustomerRuleForm"
      />
    </h2><hr>
    <p class="text-medium-emphasis my-3">
      Numero massimo di ordini al giorno che ogni punto vendita può inserire, per giorno della settimana.
    </p>
    <CustomerRuleTable />

    <h2 class="mt-8">
      Limiti per servizio
      <v-btn
        icon="mdi-open-in-new"
        style="float: right;"
        variant="text"
        to="/services"
      />
    </h2><hr>
    <p class="text-medium-emphasis my-3">
      Massimo di servizi giornalieri per tipologia: raggiunto il limite il giorno non è più selezionabile. Si
      modifica dalla pagina Servizi.
    </p>
    <v-data-table
      :items="services"
      :headers="[
        { title: 'Servizio', value: 'name' },
        { title: 'Durata (min)', value: 'duration' },
        { title: 'Max servizi giornalieri', value: 'max_services' },
        { title: 'Professionale', value: 'professional' }
      ]"
    >
      <template #[`item.max_services`]="{ item }">
        {{ item.max_services ?? 'Nessun limite' }}
      </template>
      <template #[`item.professional`]="{ item }">
        {{ item.professional ? 'Sì' : 'No' }}
      </template>
    </v-data-table>

    <h2 class="mt-8">
      Parametri di composizione dei borderò
    </h2><hr>
    <v-row class="my-2">
      <v-col
        v-for="parameter in groupingParameters"
        :key="parameter.title"
        cols="12"
        md="3"
      >
        <v-card variant="tonal">
          <v-card-text>
            <div class="text-h5">
              {{ parameter.value }}
            </div>
            <div class="font-weight-bold">
              {{ parameter.title }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ parameter.description }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <v-dialog
    v-model="popUp"
    max-width="1500"
  >
    <ConstraintPopUp v-if="popUpType == 'constraint'" />
    <GeographicCodePopUp v-if="popUpType == 'geographicCode'" />
  </v-dialog>
  <v-dialog
    v-model="geographicZoneForm"
    max-width="1500"
  >
    <GeographicZoneForm />
  </v-dialog>
  <v-dialog
    v-model="customerRuleForm"
    max-width="1500"
  >
    <CustomerRuleForm />
  </v-dialog>
</template>

<script setup>
import ConstraintPopUp from '@/components/administration/sellingPoints/ConstraintPopUp';
import CustomerRuleForm from '@/components/administration/sellingPoints/CustomerRuleForm';
import CustomerRuleTable from '@/components/administration/sellingPoints/CustomerRuleTable';
import GeographicZoneForm from '@/components/administration/sellingPoints/GeographicZoneForm';
import GeographicZoneTable from '@/components/administration/sellingPoints/GeographicZoneTable';
import GeographicCodePopUp from '@/components/administration/sellingPoints/GeographicCodePopUp';

import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useServiceStore } from '@/stores/service';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const popUp = ref(false);
const popUpType = ref('');

const userStore = useUserStore();
const { effectiveRole } = storeToRefs(userStore);
// Le rotte dei vincoli sono riservate all'admin: all'operatore la pagina li mostra
// senza i pulsanti di creazione.
const isAdmin = computed(() => effectiveRole.value == 'Admin');

const serviceStore = useServiceStore();
const services = storesUtils.getStoreList(serviceStore);

const customerRuleStore = useCustomerRuleStore();
const geographicZoneStore = useGeographicZoneStore();
const { activeForm: customerRuleForm, element: customerRule } = storeToRefs(customerRuleStore);
const { activeForm: geographicZoneForm, element: geographicZone } = storeToRefs(geographicZoneStore);

// Valori predefiniti del form di pianificazione nel borderò e limite fisso del
// motore di raggruppamento (MAX_PROFESSIONAL_ORDERS): non sono salvati per company.
const groupingParameters = [
  { title: 'Ordini minimi per borderò', value: 9, description: 'Impostabile a ogni pianificazione' },
  { title: 'Ordini massimi per borderò', value: 12, description: 'Impostabile a ogni pianificazione' },
  { title: 'Distanza massima (km)', value: 50, description: 'Per unire gruppi piccoli, impostabile a ogni pianificazione' },
  { title: 'Servizi professionali per borderò', value: 2, description: 'Limite fisso del motore di raggruppamento' }
];

const openPopUp = (item, type) => {
  geographicZone.value = item;
  popUpType.value = type;
  popUp.value = true;
};

const openCustomerRuleForm = () => {
  customerRule.value = {};
  customerRuleForm.value = true;
};

const openGeographicZoneForm = () => {
  geographicZone.value = {};
  geographicZoneForm.value = true;
};
</script>
