<template>
  <v-card
    v-if="activeForm"
    title="Crea Company"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="company.name"
              label="Nome company"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>

        <!-- Dati legali: finiscono nei PDF (oggi il DDT RAEE). Poi li gestisce
        l'admin dalla pagina di configurazione; moduli e pagamento automatico
        si accendono dalla tabella. -->
        <v-divider class="my-4" />
        <div class="text-subtitle-1 mb-2">
          Dati legali dell'attività
        </div>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.legal_name"
              label="Ragione sociale"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.vat_number"
              label="Partita IVA"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.address"
              label="Indirizzo sede legale"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.city"
              label="Città"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.tax_code"
              label="Codice fiscale (opzionale)"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />
        <div class="text-subtitle-1 mb-2">
          Amministratore della company
        </div>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.adminNickname"
              label="Nickname (usato per il login)"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.adminPassword"
              label="Password"
              type="password"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
        <v-alert
          v-if="message"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          {{ message }}
        </v-alert>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useCompanyStore } from '@/stores/company';

const form = ref(null);
const loading = ref(false);
// Messaggio di errore del backend (es. nickname admin già in uso): senza
// questo l'esito 'ko' resterebbe muto e il form sembrerebbe non rispondere.
const message = ref('');

const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  companyStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    company.value = {};
    companyStore.initList();
    activeForm.value = false;
  } else {
    message.value = data.message || 'Errore durante il salvataggio';
  }
};

watch(
  activeForm,
  (val) => {
    if (val) message.value = '';
  },
  { immediate: true }
);
</script>
