<template>
  <v-container>
    <PageHeader title="Configurazione" />

    <h2 class="text-h6 mt-4 mb-2">
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

    <template v-else-if="subscription.active || subscription.status == 'past_due'">
      <v-card class="mb-4">
        <v-card-title class="d-flex align-center">
          Piano {{ planName(subscription.plan) }}
          <v-chip
            class="ml-3"
            size="small"
            :color="statusColor"
          >
            {{ statusLabel }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <div v-if="periodEnd">
            {{ subscription.cancel_at_period_end ? 'Termina il' : 'Prossimo rinnovo il' }} {{ periodEnd }}
          </div>
          <div v-if="subscription.status == 'past_due'">
            L'ultimo pagamento non è andato a buon fine: aggiorna il metodo di pagamento.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            prepend-icon="mdi-credit-card-settings"
            text="Gestisci abbonamento"
            variant="text"
            :loading="loading"
            :color="theme.current.value.primaryColor"
            @click="openPortal"
          />
        </v-card-actions>
      </v-card>
    </template>

    <template v-else>
      <p class="mb-4">
        Scegli il piano da attivare: verrai portato alla pagina di pagamento sicura di Stripe.
      </p>
      <v-row>
        <v-col
          v-for="plan in plans"
          :key="plan.id"
          cols="12"
          md="4"
        >
          <v-card height="100%">
            <v-card-title>{{ plan.name }}</v-card-title>
            <v-card-subtitle>{{ plan.description }}</v-card-subtitle>
            <v-card-text>
              <span class="text-h4">{{ formatPrice(plan.amount) }}</span>
              <span class="text-medium-emphasis"> / mese</span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-credit-card-outline"
                text="Sottoscrivi"
                variant="text"
                :loading="loading == plan.id"
                :disabled="!!loading"
                :color="theme.current.value.primaryColor"
                @click="subscribe(plan.id)"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { useSubscriptionStore } from '@/stores/subscription';

const theme = useTheme();
const route = useRoute();
const subscriptionStore = useSubscriptionStore();
const { plans, subscription, ready, message } = storeToRefs(subscriptionStore);

// false oppure l'id del piano in corso (true per il portale): un solo
// reindirizzamento alla volta, i bottoni restano bloccati finche' si parte.
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
const statusColor = computed(() => (subscription.value.active ? 'success' : 'warning'));

const periodEnd = computed(() =>
  subscription.value.current_period_end
    ? new Date(subscription.value.current_period_end).toLocaleDateString('it-IT')
    : ''
);

const planName = (id) => plans.value.find((plan) => plan.id == id)?.name || id || '';

const formatPrice = (cents) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const stopLoading = (data) => {
  if (data.status != 'ok') loading.value = false;
};

const subscribe = (plan) => {
  loading.value = plan;
  subscriptionStore.startCheckout(plan, stopLoading);
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
