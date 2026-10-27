<template>
  <v-alert
    v-if="message"
    type="error"
    variant="tonal"
    density="compact"
    closable
    class="mb-4"
    style="flex: 0 0 auto;"
    @click:close="message = ''"
  >
    {{ message }}
    <!-- Il modulo RAEE si accende solo con almeno un luogo di smaltimento, ma il
    pulsante dei luoghi esiste solo a modulo acceso: da qui si arriva a prepararli. -->
    <template
      v-if="placesPrompt"
      #append
    >
      <v-btn
        variant="text"
        prepend-icon="mdi-recycle"
        text="Luoghi di smaltimento RAEE"
        @click="openDisposalPlaces(placesPrompt)"
      />
    </template>
  </v-alert>
  <SelectionTable
    :ready="ready"
    :items="companies"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Modulo RAEE', key: 'rae', sortable: false },
      { title: 'Pianificazione automatica', key: 'automatic_planning', sortable: false },
      { title: 'Pagamento automatico', key: 'automatic_payment', sortable: false },
      { title: 'Bloccata', key: 'blocked', sortable: false }
    ]"
    fill
  >
    <template #[`item.rae`]="{ item }">
      <v-switch
        :key="switchKey(item, 'rae')"
        :model-value="!!item.rae"
        :disabled="!!saving[`${item.id}-rae`]"
        color="success"
        density="compact"
        hide-details
        @update:model-value="(value) => toggle(item, 'rae', value)"
      />
    </template>
    <template #[`item.automatic_planning`]="{ item }">
      <v-switch
        :key="switchKey(item, 'automatic_planning')"
        :model-value="!!item.automatic_planning"
        :disabled="!!saving[`${item.id}-automatic_planning`]"
        color="success"
        density="compact"
        hide-details
        @update:model-value="(value) => toggle(item, 'automatic_planning', value)"
      />
    </template>
    <template #[`item.automatic_payment`]="{ item }">
      <v-switch
        :key="switchKey(item, 'automatic_payment')"
        :model-value="!!item.automatic_payment"
        :disabled="!!saving[`${item.id}-automatic_payment`]"
        color="success"
        density="compact"
        hide-details
        @update:model-value="(value) => toggle(item, 'automatic_payment', value)"
      />
    </template>
    <template #[`item.blocked`]="{ item }">
      <v-switch
        :key="switchKey(item, 'blocked')"
        :model-value="!!item.blocked"
        :disabled="!!saving[`${item.id}-blocked`]"
        color="error"
        density="compact"
        hide-details
        @update:model-value="(value) => toggle(item, 'blocked', value)"
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
      <!-- Le azioni di un modulo esistono solo con il modulo acceso. -->
      <v-btn
        v-if="item.rae"
        prepend-icon="mdi-recycle"
        text="Luoghi di smaltimento RAEE"
        variant="text"
        title="Luoghi di smaltimento RAEE"
        @click="openDisposalPlaces(item)"
      />
      <v-btn
        v-if="item.automatic_payment"
        prepend-icon="mdi-credit-card-edit-outline"
        text="Abbonamento"
        variant="text"
        title="Prezzo e abbonamento"
        @click="openSubscription(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanySubscriptionStore } from '@/stores/companySubscription';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const router = useRouter();
const selectLoading = reactive({});
// Salvataggi in corso per "idCompany-campo": l'interruttore si blocca finché risponde il backend.
const saving = reactive({});
// Rifiutato dal backend, un interruttore resterebbe comunque acceso a video (il
// DOM si è già mosso, la proprietà no): cambiandogli la key viene ricreato e
// torna a mostrare il valore vero.
const resets = reactive({});
// Errore dell'ultimo salvataggio (es. modulo RAEE senza iscrizione o senza luoghi).
const message = ref('');
// Company per cui l'accensione del modulo RAEE è stata rifiutata: l'avviso offre i suoi luoghi.
const placesPrompt = ref(null);

const companyStore = useCompanyStore();
const { ready } = storeToRefs(companyStore);
const { company: activeCompany } = storeToRefs(useUserStore());

const companies = storesUtils.getStoreList(companyStore);

const disposalPlaceStore = useCompanyRaeDisposalPlaceStore();
const subscriptionStore = useCompanySubscriptionStore();

// Popup a parte: gestire i luoghi è una responsabilità diversa dagli interruttori.
const openDisposalPlaces = (item) => {
  disposalPlaceStore.open(item.id);
};

const switchKey = (item, key) => `${item.id}-${key}-${resets[`${item.id}-${key}`] ?? 0}`;

// Prezzo e abbonamento sono un popup a parte: cambiare il prezzo di un
// abbonamento già attivo è una scelta, non un interruttore.
const openSubscription = (item) => {
  subscriptionStore.open(item.id);
};

// Il blocco ha un endpoint suo: non e' un campo dell'anagrafica.
const requests = {
  blocked: (item, changes, callback) => companyStore.setBlocked(item, changes.blocked, callback)
};

const save = (item, key, changes, onOk) => {
  saving[`${item.id}-${key}`] = true;
  message.value = '';
  placesPrompt.value = null;
  const request = requests[key] || ((...args) => companyStore.updateSettings(...args));
  request(item, changes, (data) => {
    saving[`${item.id}-${key}`] = false;
    if (data.status == 'ok') {
      if (onOk) onOk();
      companyStore.initList();
      // Se è la company su cui il super admin sta operando, la sessione porta
      // ancora i flag di prima: menù e rotte deciderebbero sul dato vecchio.
      if (data.company && data.company.id == activeCompany.value?.id)
        activeCompany.value = data.company;
    } else {
      resets[`${item.id}-${key}`] = (resets[`${item.id}-${key}`] ?? 0) + 1;
      message.value = data.message || 'Errore durante il salvataggio';
      if (key == 'rae') placesPrompt.value = item;
    }
  });
};

const toggle = (item, key, value) => save(item, key, { [key]: value });

const selectItem = (item) => {
  selectLoading[item.id] = true;
  companyStore.selectElement(item, (data) => {
    selectLoading[item.id] = false;
    if (data.status == 'ok') router.push('/dashboard');
  });
};
</script>
