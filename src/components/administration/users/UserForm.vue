<template>
  <v-card
    v-if="activeForm"
    title="Crea Utente"
    :subtitle="`Utenti disponibili: ${MAX_USERS - users.length}`"
    class="mt-10 mb-5"
  >
    <v-card-text v-if="MAX_USERS - users.length > 0">
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.nickname"
              :class="isMobile ? '' : 'mr-2'"
              label="Nickname"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="user.password"
              :class="isMobile ? '' : 'ml-2'"
              label="Password"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-select
          v-model="user.role"
          label="Ruolo"
          :items="['Operator', 'Customer', 'Delivery']"
          :rules="validation.requiredRules"
        />
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

  <!-- Dialog password creata -->
  <v-dialog
    v-model="createdDialog"
    max-width="500"
    persistent
  >
    <v-card title="Utente creato">
      <v-card-text>
        <v-alert
          type="success"
          class="mb-4"
        >
          Utente creato con successo
        </v-alert>
        <v-text-field
          :model-value="createdPassword"
          label="Password"
          readonly
          variant="outlined"
          append-inner-icon="mdi-content-copy"
          @click:append-inner="copyPassword"
        />
        <v-alert
          type="warning"
          variant="tonal"
          density="compact"
        >
          Comunica la password all'utente. Non sarà più visibile dopo la chiusura.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text="Chiudi"
          :color="theme.current.value.primaryColor"
          @click="closeCreatedDialog"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const MAX_USERS = 75;

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const createdDialog = ref(false);
const createdPassword = ref('');
// Messaggio di errore del backend (es. nickname già in uso): senza questo
// l'esito 'ko' resterebbe muto e il form sembrerebbe non rispondere.
const message = ref('');
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

watch(activeForm, (val) => {
  if (val) message.value = '';
});

const copyPassword = () => {
  navigator.clipboard.writeText(createdPassword.value);
};

const closeCreatedDialog = () => {
  createdDialog.value = false;
  createdPassword.value = '';
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  administrationUserStore.createElement(function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      createdPassword.value = data.password;
      createdDialog.value = true;
      user.value = {};
      administrationUserStore.initList();
      activeForm.value = false;
    } else {
      message.value = data.message || 'Errore durante la creazione dell\'utente';
    }
  });
};
</script>

