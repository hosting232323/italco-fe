<template>
  <v-card class="mb-6">
    <v-card-title>Dati dell'attività</v-card-title>
    <v-card-text>
      <v-skeleton-loader
        v-if="!ready"
        type="article"
      />
      <v-form
        v-else
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="company.name"
              label="Nome attività"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>

        <!-- Dati legali: finiscono nei PDF (oggi il DDT RAEE) -->
        <div class="text-subtitle-1 mb-2">
          Dati legali
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
          <!-- Solo col modulo RAEE acceso: compare unicamente nel DDT RAEE. -->
          <v-col
            v-if="company.rae"
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="company.rae_registration"
              label="Estremi iscrizione Albo Gestori Ambientali"
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

        <v-btn
          type="submit"
          text="Salva"
          :loading="loading"
          :color="theme.current.value.primaryColor"
          variant="flat"
        />
        <v-alert
          v-if="message"
          :type="saved ? 'success' : 'error'"
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
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { fileUtils } from 'generic-module';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useCompanyConfigurationStore } from '@/stores/companyConfiguration';

const theme = useTheme();

const form = ref(null);
const loading = ref(false);
const logoError = ref('');
const message = ref('');
const saved = ref(false);

// URL del logo già salvato (stringa) catturato al caricamento, e object URL
// dell'eventuale nuovo file scelto: servono per l'anteprima.
const savedLogoUrl = ref(null);
const newLogoObjectUrl = ref(null);

const userStore = useUserStore();
const configurationStore = useCompanyConfigurationStore();
const { element: company, ready } = storeToRefs(configurationStore);

// Il logo già salvato arriva come URL (stringa); un nuovo file lo rimpiazza
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
  // Si torna al logo salvato (per rimuoverlo serve ricaricarne un altro).
  company.value.logo = savedLogoUrl.value;
};

onBeforeUnmount(releaseObjectUrl);

const rememberSavedLogo = () => {
  savedLogoUrl.value = typeof company.value.logo === 'string' ? company.value.logo : null;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  configurationStore.updateElement(callback);
};

const callback = (data) => {
  loading.value = false;
  saved.value = data.status == 'ok';
  if (saved.value) {
    // Menù e intestazione leggono la company dalla sessione: se non la si
    // aggiorna, mostrano il nome di prima fino al prossimo login.
    userStore.company = data.company;
    company.value = data.company;
    releaseObjectUrl();
    rememberSavedLogo();
    message.value = 'Dati salvati';
  } else {
    message.value = data.message || 'Errore durante il salvataggio';
  }
};

onMounted(() => configurationStore.initData(rememberSavedLogo));
</script>
