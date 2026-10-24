<template>
  <v-alert
    v-if="message"
    type="error"
    variant="tonal"
    density="compact"
    closable
    class="mb-4"
    @click:close="message = ''"
  >
    {{ message }}
  </v-alert>
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
      <div class="d-flex align-center">
        <v-switch
          :key="switchKey(item, 'automatic_payment')"
          :model-value="!!item.automatic_payment"
          :disabled="!!saving[`${item.id}-automatic_payment`]"
          color="success"
          density="compact"
          hide-details
          @update:model-value="(value) => toggle(item, 'automatic_payment', value)"
        />
        <!-- Il prezzo mensile che l'attività paga: serve solo con il pagamento acceso. -->
        <v-text-field
          v-if="item.automatic_payment"
          :model-value="priceValue(item)"
          :disabled="!!saving[`${item.id}-subscription_price_cents`]"
          type="number"
          min="0.5"
          step="0.01"
          label="Prezzo"
          suffix="€/mese"
          density="compact"
          hide-details
          class="ml-4 price-field"
          @update:model-value="(value) => (prices[item.id] = value)"
          @blur="savePrice(item)"
          @keydown.enter="savePrice(item)"
        />
      </div>
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

import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const router = useRouter();
const selectLoading = reactive({});
// Salvataggi in corso per "idCompany-campo" e prezzi digitati ma non ancora
// salvati per idCompany: l'interruttore o il campo si bloccano finché risponde il backend.
const saving = reactive({});
const prices = reactive({});
// Rifiutato dal backend, un interruttore resterebbe comunque acceso a video (il
// DOM si è già mosso, la proprietà no): cambiandogli la key viene ricreato e
// torna a mostrare il valore vero.
const resets = reactive({});
// Errore dell'ultimo salvataggio (es. modulo RAEE senza iscrizione o senza luoghi).
const message = ref('');

const companyStore = useCompanyStore();
const { ready } = storeToRefs(companyStore);
const { company: activeCompany } = storeToRefs(useUserStore());

const companies = storesUtils.getStoreList(companyStore);

const disposalPlaceStore = useCompanyRaeDisposalPlaceStore();

// Popup a parte: gestire i luoghi è una responsabilità diversa dagli interruttori,
// e va tenuta disponibile a prescindere dal fatto che il modulo RAEE sia acceso
// (i luoghi servono proprio per poterlo accendere).
const openDisposalPlaces = (item) => {
  disposalPlaceStore.open(item.id);
};

const switchKey = (item, key) => `${item.id}-${key}-${resets[`${item.id}-${key}`] ?? 0}`;

const save = (item, key, changes, onOk) => {
  saving[`${item.id}-${key}`] = true;
  message.value = '';
  companyStore.updateSettings(item, changes, (data) => {
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
    }
  });
};

const toggle = (item, key, value) => save(item, key, { [key]: value });

const priceValue = (item) => {
  if (prices[item.id] !== undefined) return prices[item.id];
  return item.subscription_price_cents != null ? (item.subscription_price_cents / 100).toFixed(2) : '';
};

const savePrice = (item) => {
  if (prices[item.id] === undefined) return;

  const raw = prices[item.id];
  const cents = raw === '' || raw === null ? null : Math.round(Number(raw) * 100);
  if (cents === (item.subscription_price_cents ?? null)) {
    delete prices[item.id];
    return;
  }
  save(item, 'subscription_price_cents', { subscription_price_cents: cents }, () => delete prices[item.id]);
};

const selectItem = (item) => {
  selectLoading[item.id] = true;
  companyStore.selectElement(item, (data) => {
    selectLoading[item.id] = false;
    if (data.status == 'ok') router.push('/dashboard');
  });
};
</script>

<style scoped>
.price-field {
  max-width: 190px;
}
</style>
