<template>
  <h2 class="text-h6 mb-2">
    Abbonamento
  </h2>
  <v-alert
    v-if="checkoutResult == 'success'"
    type="success"
    variant="tonal"
    class="mb-4"
  >
    Pagamento completato. Se lo stato non si aggiorna subito, ricarica la pagina tra qualche istante.
  </v-alert>
  <v-alert
    v-else-if="checkoutResult == 'cancel'"
    type="info"
    variant="tonal"
    class="mb-4"
  >
    Sottoscrizione annullata: nessun addebito.
  </v-alert>
  <v-alert
    v-if="message"
    type="error"
    variant="tonal"
    class="mb-4"
  >
    {{ message }}
  </v-alert>

  <v-progress-linear
    v-if="!ready"
    indeterminate
  />

  <v-card
    v-else
    class="mb-4"
  >
    <v-card-title class="d-flex align-center">
      Abbonamento Hubstra
      <v-chip
        class="ml-3"
        size="small"
        :color="subscription.active ? 'success' : 'warning'"
      >
        {{ statusLabel }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <div v-if="priceCents">
        <span class="text-h4">{{ formatPrice(priceCents) }}</span>
        <span class="text-medium-emphasis"> / mese</span>
      </div>
      <div v-else>
        Il prezzo dell'abbonamento non è ancora stato definito: contatta il supporto.
      </div>
      <div
        v-if="periodEnd"
        class="mt-2"
      >
        {{ subscription.cancel_at_period_end ? 'Termina il' : 'Prossimo rinnovo il' }} {{ periodEnd }}
      </div>
      <div
        v-if="subscription.status == 'past_due'"
        class="mt-2"
      >
        L'ultimo pagamento non è andato a buon fine: aggiorna il metodo di pagamento.
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="subscription.active || subscription.status == 'past_due'"
        prepend-icon="mdi-credit-card-settings"
        text="Gestisci abbonamento"
        variant="text"
        :loading="loading"
        :color="theme.current.value.primaryColor"
        @click="openPortal"
      />
      <v-btn
        v-else
        prepend-icon="mdi-credit-card-outline"
        text="Sottoscrivi"
        variant="text"
        :loading="loading"
        :disabled="!priceCents"
        :color="theme.current.value.primaryColor"
        @click="subscribe"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscription';

const theme = useTheme();
const route = useRoute();
const subscriptionStore = useSubscriptionStore();
const { priceCents, subscription, ready, message } = storeToRefs(subscriptionStore);

// Un solo reindirizzamento alla volta: il bottone resta in caricamento finché si parte.
const loading = ref(false);

const checkoutResult = computed(() => route.query.checkout);

const STATUS_LABELS = {
  active: 'Attivo',
  trialing: 'In prova',
  past_due: 'Pagamento in ritardo',
  canceled: 'Annullato',
  incomplete: 'Incompleto',
  none: 'Nessun abbonamento'
};

const statusLabel = computed(() => STATUS_LABELS[subscription.value.status] || subscription.value.status);

const periodEnd = computed(() =>
  subscription.value.current_period_end
    ? new Date(subscription.value.current_period_end).toLocaleDateString('it-IT')
    : ''
);

const formatPrice = (cents) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const stopLoading = (data) => {
  if (data.status != 'ok') loading.value = false;
};

const subscribe = () => {
  loading.value = true;
  subscriptionStore.startCheckout(stopLoading);
};

const openPortal = () => {
  loading.value = true;
  subscriptionStore.openPortal(stopLoading);
};

onMounted(() => {
  // Dopo il pagamento si rilegge Stripe prima di mostrare lo stato: il webhook
  // puo' non essere ancora arrivato.
  if (checkoutResult.value == 'success')
    subscriptionStore.sync(() => subscriptionStore.initData());
  else
    subscriptionStore.initData();
});
</script>
