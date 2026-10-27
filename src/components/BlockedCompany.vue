<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="5"
      >
        <v-card
          class="text-center pa-6"
          rounded="xl"
          elevation="4"
        >
          <v-avatar
            size="88"
            class="mb-3"
            :color="theme.current.value.primaryColor"
            variant="tonal"
          >
            <v-icon
              icon="mdi-lock-outline"
              size="48"
              :color="theme.current.value.primaryColor"
            />
          </v-avatar>
          <v-card-title
            class="text-h5 font-weight-bold text-wrap"
            :style="{ color: theme.current.value.primaryColor }"
          >
            Attività bloccata
          </v-card-title>
          <v-card-text>
            <p v-if="company?.name">
              L'accesso a <strong>{{ company.name }}</strong> è stato sospeso.
            </p>
            <p v-else>
              L'accesso all'attività è stato sospeso.
            </p>
            <v-progress-linear
              v-if="checking"
              indeterminate
              class="mt-4"
            />
            <p
              v-else-if="!canPayToUnblock"
              class="mt-2"
            >
              {{ isAdmin ? 'Non puoi usare il gestionale finché non viene sbloccata. ' : '' }}Contatta l'amministratore di sistema.
            </p>
            <template v-else>
              <p class="mt-2">
                Puoi sbloccare l'attività subito con il pagamento dell'abbonamento
                <template v-if="priceCents">
                  ({{ subscriptionUtils.formatPrice(priceCents) }} / mese)
                </template>.
                Il pagamento avviene sulla pagina sicura di Stripe e l'accesso torna disponibile appena viene confermato.
              </p>
              <v-alert
                v-if="message"
                type="error"
                variant="tonal"
                density="compact"
                class="mt-3"
              >
                {{ message }}
              </v-alert>
            </template>
          </v-card-text>
          <v-card-actions class="justify-center flex-wrap ga-2">
            <template v-if="canPayToUnblock && !checking">
              <v-btn
                v-if="subscription.status == 'past_due'"
                prepend-icon="mdi-credit-card-settings-outline"
                text="Aggiorna il pagamento"
                variant="flat"
                :loading="loading"
                :color="theme.current.value.primaryColor"
                @click="openPortal"
              />
              <v-btn
                v-else
                prepend-icon="mdi-lock-open-variant-outline"
                text="Sblocca con il pagamento"
                variant="flat"
                :loading="loading"
                :disabled="!priceCents"
                :color="theme.current.value.primaryColor"
                @click="subscribe"
              />
              <v-btn
                prepend-icon="mdi-refresh"
                text="Ho già pagato"
                variant="text"
                @click="checkPayment"
              />
            </template>
            <v-btn
              prepend-icon="mdi-logout"
              text="Esci"
              variant="text"
              @click="logoutModule.logout(router)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import logoutModule from '@/utils/logout';
import subscriptionUtils from '@/utils/subscription';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useSubscriptionStore } from '@/stores/subscription';
import { useCompanyConfigurationStore } from '@/stores/companyConfiguration';

const theme = useTheme();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const subscriptionStore = useSubscriptionStore();
const { role, company } = storeToRefs(userStore);
const { priceCents, subscription, ready, message } = storeToRefs(subscriptionStore);

const loading = ref(false);

const isAdmin = computed(() => role.value == 'Admin');

// Chi paga puo' sbloccarsi solo se non sta gia' pagando: un abbonamento attivo su
// un'attivita' bloccata e' un blocco voluto dal super admin, il pagamento non lo toglie.
const canPayToUnblock = computed(() =>
  isAdmin.value && !!company.value?.automatic_payment && !subscription.value.active
);

// Finche' lo stato dell'abbonamento non e' arrivato non si sa se il pagamento e'
// un'opzione: niente testo ne' pulsanti, altrimenti compaiono e poi spariscono.
const checking = computed(() => isAdmin.value && !!company.value?.automatic_payment && !ready.value);

// Il pagamento sblocca da solo lato backend (webhook o sync): qui si rilegge
// l'attivita' e, se il blocco e' caduto, il layout torna all'app.
const refreshCompany = () => {
  useCompanyConfigurationStore().syncSession();
};

const checkPayment = () => {
  subscriptionStore.sync(() => {
    subscriptionStore.initData(refreshCompany);
  });
};

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
  // Dopo un reload la company e' quella salvata nel browser: se nel frattempo
  // l'attivita' e' stata sbloccata, il blocco cade qui senza rifare il login.
  refreshCompany();
  if (!isAdmin.value || !company.value?.automatic_payment) return;
  // Al ritorno da Stripe il webhook puo' non essere ancora arrivato: si rilegge.
  if (route.query.checkout == 'success') checkPayment();
  else subscriptionStore.initData();
});
</script>
