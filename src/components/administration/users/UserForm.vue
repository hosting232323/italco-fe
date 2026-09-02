<template>
  <v-card
    v-if="activeForm"
    :title="user.id ? `Modifica Utente ${user.id}` : 'Crea Utente'"
    :subtitle="user.id ? '' : `Utenti disponibili: ${MAX_USERS - users.length}`"
    class="mt-10 mb-5"
  >
    <v-card-text v-if="user.id || MAX_USERS - users.length > 0">
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
              v-model="user.email"
              :class="isMobile ? '' : 'mr-2'"
              label="Email"
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
              :label="user.id ? 'Nuova password (lascia vuoto per non modificarla)' : 'Password'"
              :rules="user.id ? [] : validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-select
          v-if="!user.id"
          v-model="user.role"
          label="Ruolo"
          :items="['Operator', 'Customer', 'Delivery']"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
      <v-alert
        v-if="message"
        class="mt-5 mb-5"
      >
        {{ message }}
      </v-alert>
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

import { ref } from 'vue';
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
// Messaggio di errore del backend (es. email già in uso): senza questo
// l'esito 'ko' resterebbe muto e il form sembrerebbe non rispondere.
const message = ref('');
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

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
  if (user.value.id) {
    administrationUserStore.updateElement(function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        user.value = {};
        administrationUserStore.initList();
        activeForm.value = false;
      } else {
        message.value = data.message || 'Errore durante la modifica dell\'utente';
      }
    });
  } else {
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
  }
};
</script>

