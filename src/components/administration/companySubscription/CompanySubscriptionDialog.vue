<template>
  <v-card
    v-if="dialogOpen"
    :title="`Abbonamento — ${companyName}`"
  >
    <v-card-text>
      <v-progress-linear
        v-if="!ready"
        indeterminate
      />
      <template v-else>
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <v-chip
            :color="subscriptionUtils.statusColor(subscription.status)"
            size="small"
          >
            {{ subscriptionUtils.statusLabel(subscription.status) }}
          </v-chip>
          <span v-if="priceCents">
            Prezzo attuale: <strong>{{ subscriptionUtils.formatPrice(priceCents) }} / mese</strong>
          </span>
          <span v-else>
            Prezzo non ancora definito
          </span>
          <span
            v-if="subscription.current_period_end"
            class="text-medium-emphasis"
          >
            {{ subscription.cancel_at_period_end ? 'Termina il' : 'Prossimo rinnovo il' }}
            {{ subscriptionUtils.formatDate(subscription.current_period_end) }}
          </span>
        </div>

        <v-text-field
          v-model="price"
          type="number"
          min="0.5"
          step="0.01"
          label="Nuovo prezzo mensile"
          suffix="€ / mese"
          :rules="priceRules"
        />

        <!-- Con un abbonamento attivo il prezzo va deciso: Stripe non ricalcola da
        solo gli abbonamenti già in corso, che mantengono quello con cui il cliente
        si è abbonato finché non li si sposta. Lo spostamento vale dal prossimo
        rinnovo, senza addebiti né crediti immediati e senza che il cliente debba riabbonarsi. -->
        <template v-if="subscription.active">
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            L'attività ha un abbonamento attivo: scegli se il nuovo prezzo vale anche per quello.
          </v-alert>
          <v-radio-group
            v-model="applyToActive"
            hide-details
          >
            <v-radio
              label="Applica anche all'abbonamento attivo, dal prossimo rinnovo (nessuna interruzione, nessun addebito immediato)"
              :value="true"
            />
            <v-radio
              label="Solo ai nuovi abbonamenti: quello attivo mantiene il prezzo attuale"
              :value="false"
            />
          </v-radio-group>
        </template>

        <v-btn
          :loading="loading"
          :disabled="!validPrice"
          :color="theme.current.value.primaryColor"
          variant="flat"
          class="mt-4"
          text="Salva prezzo"
          @click="save"
        />
        <v-alert
          v-if="message"
          :type="saved ? 'success' : 'error'"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          {{ message }}
        </v-alert>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import subscriptionUtils from '@/utils/subscription';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useCompanyStore } from '@/stores/company';
import { useCompanySubscriptionStore } from '@/stores/companySubscription';

const theme = useTheme();

const companyStore = useCompanyStore();
const { list: companies } = storeToRefs(companyStore);

const store = useCompanySubscriptionStore();
const { dialogOpen, companyId, priceCents, subscription, ready } = storeToRefs(store);

const companyName = computed(() => companies.value?.find((item) => item.id == companyId.value)?.name ?? companyId.value);

const price = ref('');
const applyToActive = ref(true);
const loading = ref(false);
const message = ref('');
const saved = ref(false);

const MIN_PRICE = 0.5;

const validPrice = computed(() => Number(price.value) >= MIN_PRICE);
const priceRules = [() => validPrice.value || `Il prezzo minimo è ${MIN_PRICE} €`];

// Il campo parte dal prezzo corrente ogni volta che si apre o si ricarica il popup.
watch(
  [companyId, ready],
  () => {
    if (!ready.value) return;
    price.value = priceCents.value != null ? (priceCents.value / 100).toFixed(2) : '';
    applyToActive.value = true;
    message.value = '';
  },
  { immediate: true }
);

const save = () => {
  message.value = '';
  loading.value = true;
  store.updatePrice(Math.round(Number(price.value) * 100), subscription.value.active && applyToActive.value, (data) => {
    loading.value = false;
    saved.value = data.status == 'ok';
    message.value = saved.value ? 'Prezzo aggiornato' : data.message || 'Errore durante il salvataggio';
    if (saved.value) companyStore.initList();
  });
};
</script>
