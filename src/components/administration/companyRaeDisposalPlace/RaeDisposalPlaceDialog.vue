<template>
  <v-card
    v-if="dialogOpen"
    :title="`Luoghi di smaltimento RAEE — ${companyName}`"
  >
    <v-card-text>
      <!-- Modulo RAEE (Sì/No) ed estremi iscrizione all'Albo Gestori Ambientali
      sulla stessa riga: l'iscrizione è dell'attività, una sola, va compilata
      per accendere il modulo (il backend rifiuta senza) e da qui si modifica
      anche a modulo già acceso. -->
      <v-row
        no-gutters
        align="center"
        class="mb-4"
      >
        <v-col
          cols="12"
          md="4"
          class="d-flex align-center pr-md-2"
        >
          <label class="mr-2">Modulo RAEE</label>
          <v-radio-group
            :model-value="raeValue"
            inline
            hide-details
            :disabled="raeLoading"
          >
            <v-radio
              label="Sì"
              :value="true"
              @click="setRae(true)"
            />
            <v-radio
              label="No"
              :value="false"
              @click="setRae(false)"
            />
          </v-radio-group>
        </v-col>
        <v-col
          v-if="raeValue"
          cols="12"
          md="6"
          class="px-md-2"
        >
          <v-text-field
            v-model="registration"
            label="Estremi iscrizione Albo Gestori Ambientali"
            hide-details
            :disabled="raeLoading"
          />
        </v-col>
        <v-col
          v-if="raeValue"
          cols="12"
          md="2"
          class="d-flex align-center pl-md-2"
        >
          <v-btn
            block
            :loading="raeLoading"
            :color="theme.current.value.primaryColor"
            @click="saveRegistration"
          >
            Salva
          </v-btn>
        </v-col>
      </v-row>

      <v-alert
        v-if="raeError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ raeError }}
      </v-alert>

      <template v-if="raeValue">
        <v-divider class="mb-4" />
        <div class="text-right mb-2">
          <v-btn
            icon="mdi-plus"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm"
          />
        </div>
        <RaeDisposalPlaceForm />
        <RaeDisposalPlaceTable />
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import RaeDisposalPlaceTable from './RaeDisposalPlaceTable';
import RaeDisposalPlaceForm from './RaeDisposalPlaceForm';

import http from '@/utils/http';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const theme = useTheme();

const userStore = useUserStore();
const companyStore = useCompanyStore();
const { list: companies } = storeToRefs(companyStore);

const store = useCompanyRaeDisposalPlaceStore();
const { dialogOpen, companyId, element: place, activeForm } = storeToRefs(store);

const company = computed(() => companies.value?.find((item) => item.id == companyId.value));
const companyName = computed(() => company.value?.name ?? companyId.value);

// Stato desiderato del toggle, non (solo) quello confermato dal backend: un
// primo "Sì" senza iscrizione o senza nessun luogo va rifiutato dal server,
// ma la sezione deve restare visibile per poterli compilare, non richiudersi
// sull'errore.
const raeValue = ref(false);
const registration = ref('');
const raeError = ref('');
const raeLoading = ref(false);

watch(companyId, (id) => {
  if (!id) return;
  raeValue.value = !!company.value?.rae;
  registration.value = company.value?.rae_registration ?? '';
  raeError.value = '';
}, { immediate: true });

const setRae = (value) => {
  raeValue.value = value;
  raeError.value = '';
  raeLoading.value = true;

  http.makeRequest(
    `company/${companyId.value}`,
    'PUT',
    { body: { name: company.value.name, rae: value, ...(value ? { rae_registration: registration.value } : {}) } },
    (data) => {
      raeLoading.value = false;
      if (data.status == 'ok') {
        companyStore.initList();
        // Stesso trattamento di CompanyForm: se e' la company su cui il
        // super admin sta operando, il flag in sessione va aggiornato subito.
        if (data.company && data.company.id == userStore.company?.id)
          userStore.company = data.company;
      } else {
        raeError.value = data.message;
      }
    }
  );
};

// Salva l'iscrizione a modulo acceso: è la stessa PUT che accende il modulo,
// con rae già a true.
const saveRegistration = () => setRae(true);

const openForm = () => {
  place.value = {};
  activeForm.value = true;
};
</script>
