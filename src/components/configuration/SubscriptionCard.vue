<template>
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

  <v-card class="mb-4">
    <v-card-item
      prepend-icon="mdi-credit-card-outline"
      title="Abbonamento"
      subtitle="Il tuo piano mensile Hubstra"
    >
      <template
        v-if="ready"
        #append
      >
        <v-chip
          size="small"
          variant="flat"
          :color="subscriptionUtils.statusColor(subscription.status)"
        >
          {{ subscriptionUtils.statusLabel(subscription.status) }}
        </v-chip>
      </template>
    </v-card-item>
    <v-divider />

    <v-progress-linear
      v-if="!ready"
      indeterminate
    />
    <template v-else>
      <v-card-text>
        <v-row align="center">
          <v-col
            cols="12"
            sm="5"
          >
            <div class="text-caption text-medium-emphasis">
              Importo
            </div>
            <div v-if="priceCents">
              <span class="text-h4 font-weight-bold">{{ subscriptionUtils.formatPrice(priceCents) }}</span>
              <span class="text-medium-emphasis"> / mese</span>
            </div>
            <div v-else>
              Il prezzo dell'abbonamento non è ancora stato definito: contatta il supporto.
            </div>
          </v-col>
          <v-col
            v-if="periodEnd"
            cols="12"
            sm="7"
          >
            <div class="text-caption text-medium-emphasis">
              {{ subscription.cancel_at_period_end ? 'Termina il' : 'Prossimo rinnovo' }}
            </div>
            <div class="text-h6">
              <v-icon
                icon="mdi-calendar-sync-outline"
                size="small"
                class="mr-1"
              />
              {{ periodEnd }}
            </div>
          </v-col>
        </v-row>
        <v-alert
          v-if="subscription.status == 'past_due'"
          type="warning"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          L'ultimo pagamento non è andato a buon fine: aggiorna il metodo di pagamento.
        </v-alert>
        <div
          v-else-if="!subscription.active"
          class="text-medium-emphasis mt-4"
        >
          Verrai portato alla pagina di pagamento sicura di Stripe.
        </div>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-btn
          v-if="subscription.active || subscription.status == 'past_due'"
          prepend-icon="mdi-credit-card-settings-outline"
          text="Gestisci abbonamento"
          variant="flat"
          :loading="loading"
          :color="theme.current.value.primaryColor"
          @click="openPortal"
        />
        <v-btn
          v-else
          prepend-icon="mdi-credit-card-check-outline"
          text="Sottoscrivi"
          variant="flat"
          :loading="loading"
          :disabled="!priceCents"
          :color="theme.current.value.primaryColor"
          @click="subscribe"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup>
import subscriptionUtils from '@/utils/subscription';

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

const periodEnd = computed(() => subscriptionUtils.formatDate(subscription.value.current_period_end));

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
