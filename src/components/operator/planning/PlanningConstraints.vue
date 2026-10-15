<template>
  <div>
    <p class="text-medium-emphasis my-3">
      Tutti i vincoli che regolano quando e quanto si può ordinare, in un unico posto.
    </p>

    <h2>
      Limiti per area geografica
      <v-tooltip
        location="bottom"
        max-width="400"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-information-outline"
            size="small"
            class="ml-1"
          />
        </template>
        Numero massimo di ordini per giorno della settimana in ogni area. Se per un'area non è configurato nulla, i punti vendita non potranno effettuare ordini per i clienti di quella zona.
      </v-tooltip>
      <v-btn
        v-if="isAdmin"
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openGeographicZoneForm"
      />
    </h2><hr>
    Attenzione: Se non vengono configurate regole per una certa area geografica,
    i punti vendita non potranno effettuare ordini per i clienti di quella zona.
    <GeographicZoneTable @open-pop-up="openPopUp" />

    <h2 class="mt-8">
      Limiti per punto vendita
      <v-tooltip
        location="bottom"
        max-width="400"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-information-outline"
            size="small"
            class="ml-1"
          />
        </template>
        Numero massimo di ordini al giorno che ogni punto vendita può inserire, per giorno della settimana.
      </v-tooltip>
      <v-btn
        v-if="isAdmin"
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openCustomerRuleForm"
      />
    </h2><hr>
    <CustomerRuleTable />

    <h2 class="mt-8">
      Limiti per servizio
      <v-tooltip
        location="bottom"
        max-width="400"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-information-outline"
            size="small"
            class="ml-1"
          />
        </template>
        Massimo di servizi giornalieri per tipologia: raggiunto il limite il giorno non è più selezionabile. Si modifica dalla pagina Servizi.
      </v-tooltip>
      <v-btn
        icon="mdi-open-in-new"
        style="float: right;"
        variant="text"
        to="/services"
      />
    </h2><hr>
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
