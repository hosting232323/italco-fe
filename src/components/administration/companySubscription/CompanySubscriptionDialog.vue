<template>
  <v-card
    v-if="dialogOpen"
    :title="`Abbonamento — ${companyName}`"
    class="dialog-card"
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

      <v-divider class="my-6" />
      <div class="text-subtitle-1 mb-3 d-flex align-center">
        <v-icon
          icon="mdi-history"
          class="mr-2"
        />
        Storico pagamenti
      </div>
      <v-progress-linear
        v-if="!historyReady"
        indeterminate
      />
      <v-alert
        v-else-if="historyMessage"
        type="error"
        variant="tonal"
        density="compact"
      >
        {{ historyMessage }}
      </v-alert>
      <v-alert
        v-else-if="!history.invoices.length"
        type="info"
        variant="tonal"
        density="compact"
      >
        Nessun pagamento: l'attività non ha ancora sottoscritto un abbonamento.
      </v-alert>
      <template v-else>
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <v-chip
            size="small"
            variant="flat"
            :color="history.summary.regular ? 'success' : 'warning'"
            :prepend-icon="history.summary.regular ? 'mdi-check-circle' : 'mdi-alert-circle'"
          >
            {{ history.summary.regular ? 'Pagamenti sempre regolari' : 'Pagamenti con irregolarità' }}
          </v-chip>
          <span v-if="history.summary.customer_since">
            Paga dal <strong>{{ subscriptionUtils.formatDate(history.summary.customer_since) }}</strong>
          </span>
          <span>
            {{ history.summary.paid_count }} saldate,
            <strong>{{ subscriptionUtils.formatPrice(history.summary.paid_total_cents) }}</strong> incassati
          </span>
          <span
            v-if="history.summary.unpaid_count"
            class="text-error"
          >
            {{ history.summary.unpaid_count }} non saldate
          </span>
          <span
            v-if="history.summary.retried_count"
            class="text-warning"
          >
            {{ history.summary.retried_count }} saldate solo dopo un nuovo tentativo
          </span>
        </div>

        <v-table density="compact">
          <thead>
            <tr>
              <th>Data</th>
              <th>Fattura</th>
              <th>Importo</th>
              <th>Stato</th>
              <th>Tentativi</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="invoice in history.invoices"
              :key="invoice.id"
            >
              <td>{{ subscriptionUtils.formatDate(invoice.paid_at || invoice.created) }}</td>
              <td>{{ invoice.number || invoice.id }}</td>
              <td>{{ subscriptionUtils.formatPrice(invoice.amount_cents) }}</td>
              <td>
                <v-chip
                  size="small"
                  :color="subscriptionUtils.invoiceStatusColor(invoice.status)"
                >
                  {{ subscriptionUtils.invoiceStatusLabel(invoice.status) }}
                </v-chip>
              </td>
              <td>{{ invoice.attempts }}</td>
              <td>
                <v-btn
                  v-if="invoice.url"
                  :href="invoice.url"
                  target="_blank"
                  rel="noopener"
                  icon="mdi-open-in-new"
                  variant="text"
                  size="small"
                  title="Apri la fattura su Stripe"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="text-subtitle-2 mt-6 mb-2">
          Abbonamenti
        </div>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Avviato il</th>
              <th>Stato</th>
              <th>Terminato il</th>
              <th>Prezzo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in history.subscriptions"
              :key="record.id"
            >
              <td>{{ subscriptionUtils.formatDate(record.created) }}</td>
              <td>
                <v-chip
                  size="small"
                  :color="subscriptionUtils.statusColor(record.status)"
                >
                  {{ subscriptionUtils.statusLabel(record.status) }}
                </v-chip>
              </td>
              <td>{{ subscriptionUtils.formatDate(record.ended_at) || '—' }}</td>
              <td>{{ record.price_cents ? `${subscriptionUtils.formatPrice(record.price_cents)} / mese` : '—' }}</td>
            </tr>
          </tbody>
        </v-table>
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
const { dialogOpen, companyId, priceCents, subscription, ready, history, historyReady, historyMessage } =
  storeToRefs(store);

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

<style scoped>
/* Con lo storico il popup può superare l'altezza della finestra: scorre il contenuto. */
.dialog-card {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
