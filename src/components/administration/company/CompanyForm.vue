<template>
  <v-card
    v-if="activeForm"
    :title="company.id ? `Modifica Company ${company.id}` : 'Crea Company'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.name"
              label="Nome company"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <label class="mr-2">Modulo RAEE</label>
            <v-radio-group
              v-model="company.rae"
              inline
            >
              <v-radio
                label="Sì"
                :value="true"
                @click="company.rae = true"
              />
              <v-radio
                label="No"
                :value="false"
                @click="company.rae = false"
              />
            </v-radio-group>
          </v-col>
        </v-row>

        <!-- Dati legali: finiscono nei PDF (oggi il DDT RAEE) -->
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

        <!-- Campi legali specifici RAEE: obbligatori solo con il modulo acceso -->
        <v-row
          v-if="company.rae"
          no-gutters
        >
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.rae_registration"
              label="Estremi iscrizione Albo Gestori Ambientali"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.rae_grouping_place"
              label="Luogo di raggruppamento RAEE"
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
            <v-file-input
              label="Logo aziendale (opzionale)"
              :accept="fileUtils.buildAccept(fileUtils.imageExtensions)"
              :error-messages="logoError"
              prepend-icon="mdi-image"
              clearable
              @change="onLogoSelected"
              @click:clear="onLogoCleared"
            />
            <div
              v-if="logoPreview"
              class="mb-3"
            >
              <v-img
                :src="logoPreview"
                :max-height="120"
                :max-width="220"
                class="border rounded"
              />
              <div class="text-caption mt-1">
                {{ hasNewLogo ? 'Anteprima del nuovo logo' : 'Logo attuale' }}
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Campi admin: solo in creazione -->
        <template v-if="!company.id">
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
        </template>
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

import http from '@/utils/http';
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { fileUtils } from 'generic-module';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';

const form = ref(null);
const loading = ref(false);
const logoError = ref('');
// Messaggio di errore del backend (es. nickname admin già in uso): senza
// questo l'esito 'ko' resterebbe muto e il form sembrerebbe non rispondere.
const message = ref('');

// URL del logo già salvato (stringa) catturato all'apertura del form, e
// object URL dell'eventuale nuovo file scelto: servono per l'anteprima.
const savedLogoUrl = ref(null);
const newLogoObjectUrl = ref(null);

const userStore = useUserStore();
const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

// In modifica il logo arriva come URL (stringa); un nuovo file lo rimpiazza
// con { selectedFile }, che è quello che l'http client sa impacchettare.
const hasNewLogo = computed(() => !!company.value.logo && typeof company.value.logo === 'object');

const logoPreview = computed(() => {
  if (newLogoObjectUrl.value) return newLogoObjectUrl.value;
  if (!savedLogoUrl.value) return null;
  // La rotta del logo vuole il token; updated_at fa da cache-buster così dopo
  // un aggiornamento si vede subito la nuova immagine e non quella in cache.
  const version = encodeURIComponent(company.value.updated_at || '');
  return `${http.withSessionToken(savedLogoUrl.value)}&v=${version}`;
});

const releaseObjectUrl = () => {
  if (newLogoObjectUrl.value) {
    URL.revokeObjectURL(newLogoObjectUrl.value);
    newLogoObjectUrl.value = null;
  }
};

const onLogoSelected = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  logoError.value = fileUtils.validateFiles([file], fileUtils.imageExtensions) || '';
  if (logoError.value) return;

  releaseObjectUrl();
  newLogoObjectUrl.value = URL.createObjectURL(file);
  company.value.logo = { selectedFile: file };
};

const onLogoCleared = () => {
  releaseObjectUrl();
  logoError.value = '';
  // In modifica si torna al logo salvato (per rimuoverlo serve ricaricarne
  // un altro); in creazione semplicemente non c'è logo.
  company.value.logo = savedLogoUrl.value;
};

onBeforeUnmount(releaseObjectUrl);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  if (company.value.id)
    companyStore.updateElement(callback);
  else
    companyStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    // Se il super admin ha appena modificato la company su cui sta operando,
    // il flag RAEE in sessione è vecchio: menù e rotte deciderebbero sul dato
    // precedente fino al prossimo login.
    if (data.company && data.company.id == userStore.company?.id)
      userStore.company = data.company;

    releaseObjectUrl();
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
    if (!val) return;

    if (company.value.rae == undefined) company.value.rae = false;
    logoError.value = '';
    message.value = '';
    releaseObjectUrl();
    savedLogoUrl.value = typeof company.value.logo === 'string' ? company.value.logo : null;
  },
  { immediate: true }
);
</script>
