<template>
  <v-dialog
    v-model="deleteDialog"
    max-width="1500"
  >
    <template #activator>
      <v-skeleton-loader
        v-if="!ready"
        type="table"
        :color="theme.current.value.secondaryColor"
        class="mt-5"
      />
      <v-data-table
        v-else
        :items="users"
        :headers="[
          { title: 'ID', value: 'id', sortable: false },
          { title: 'Nickname', value: 'nickname', sortable: false },
          { title: 'Email', value: 'email', sortable: false },
          { title: 'Ruolo', value: 'role', sortable: false },
          { title: 'Azioni', key: 'actions', sortable: false }
        ]"
      >
        <template #[`item.actions`]="{ item }">
          <template v-if="item.role !== 'Admin'">
            <v-btn
              icon="mdi-email-edit"
              variant="text"
              :color="theme.current.value.primaryColor"
              @click="openEmailDialog(item)"
            />
            <v-btn
              icon="mdi-lock-reset"
              variant="text"
              :color="theme.current.value.primaryColor"
              @click="openResetDialog(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              :loading="deleteLoading[item.id]"
              :color="theme.current.value.primaryColor"
              @click="deleteItem(item)"
            />
          </template>
        </template>
      </v-data-table>
    </template>
    <template #default>
      <v-card title="Attenzione!">
        <v-card-text>
          <p>Stai per cancellare l'utente: <strong>{{ element.nickname }}</strong></p>
          <ul style="margin-left: 20px;">
            <li>Verranno rimossi {{ element.serviceUsers }} servizi collegati</li>
            <li>Verranno rimosse {{ element.customerRules }} regole personalizzate</li>
            <li>Verranno rimossi {{ element.collectionPoints }} punti di ritiro</li>
            <li v-if="element.blockedOrders > 0">
              Non sarà possibile cancellare l'utente perché ci sono {{ element.blockedOrders }} ordini attivi
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Annulla"
            :color="theme.current.value.primaryColor"
            @click="deleteDialog = false"
          />
          <v-spacer />
          <v-btn
            text="Conferma"
            :color="theme.current.value.primaryColor"
            :disabled="element.blockedOrders > 0"
            @click="deleteItem(element, true)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>

  <!-- Dialog Modifica Email -->
  <v-dialog
    v-model="emailDialog"
    max-width="500"
    persistent
  >
    <v-card title="Modifica email">
      <v-card-subtitle>{{ emailTarget?.nickname }}</v-card-subtitle>
      <v-card-text>
        <v-form
          ref="emailForm"
          @submit.prevent="submitEmail"
        >
          <v-text-field
            v-model="emailInput"
            label="Email"
            :rules="validation.optionalEmailRules"
          />
        </v-form>
        <v-alert
          v-if="emailError"
          type="error"
          variant="tonal"
          density="compact"
        >
          {{ emailError }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text="Annulla"
          :color="theme.current.value.primaryColor"
          @click="emailDialog = false"
        />
        <v-spacer />
        <v-btn
          text="Salva"
          variant="elevated"
          :color="theme.current.value.primaryColor"
          :loading="emailLoading"
          @click="submitEmail"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Reimposta Password -->
  <v-dialog
    v-model="resetDialog"
    max-width="500"
    persistent
  >
    <v-card title="Reimposta password">
      <v-card-subtitle>{{ resetTarget?.nickname }}</v-card-subtitle>
      <v-card-text>
        <template v-if="!resetResult">
          <v-text-field
            v-model="resetInput"
            label="Nuova password (lascia vuoto per generarne una)"
            :append-inner-icon="showResetInput ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showResetInput ? 'text' : 'password'"
            @click:append-inner="showResetInput = !showResetInput"
          />
        </template>
        <template v-else>
          <v-alert
            type="success"
            class="mb-4"
          >
            Password reimpostata con successo
          </v-alert>
          <v-text-field
            :model-value="resetResult"
            label="Nuova password"
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
            Copia la password adesso. Non sarà più visibile dopo la chiusura.
          </v-alert>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :text="resetResult ? 'Chiudi' : 'Annulla'"
          :color="theme.current.value.primaryColor"
          @click="closeResetDialog"
        />
        <v-spacer />
        <v-btn
          v-if="!resetResult"
          text="Salva"
          variant="elevated"
          :color="theme.current.value.primaryColor"
          :loading="resetLoading"
          @click="submitReset"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { ref, reactive  } from 'vue';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const element = ref({});
const theme = useTheme();
const deleteDialog = ref(false);
const deleteLoading = reactive({});

// Modifica email state
const emailDialog = ref(false);
const emailTarget = ref(null);
const emailInput = ref('');
const emailError = ref('');
const emailLoading = ref(false);
const emailForm = ref(null);

// Reset password state
const resetDialog = ref(false);
const resetTarget = ref(null);
const resetInput = ref('');
const resetResult = ref('');
const resetLoading = ref(false);
const showResetInput = ref(false);

const administrationUserStore = useAdministrationUserStore();
const { ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

const openEmailDialog = (item) => {
  emailTarget.value = item;
  emailInput.value = item.email || '';
  emailError.value = '';
  emailLoading.value = false;
  emailDialog.value = true;
};

const submitEmail = async () => {
  const { valid } = await emailForm.value.validate();
  if (!valid) return;
  emailLoading.value = true;
  emailError.value = '';
  administrationUserStore.updateUser(emailTarget.value.id, { email: emailInput.value }, (data) => {
    emailLoading.value = false;
    if (data.status == 'ok') {
      emailDialog.value = false;
      administrationUserStore.initList();
    } else {
      emailError.value = data.message || 'Errore durante la modifica della email';
    }
  });
};

const openResetDialog = (item) => {
  resetTarget.value = item;
  resetInput.value = '';
  resetResult.value = '';
  resetLoading.value = false;
  showResetInput.value = false;
  resetDialog.value = true;
};

const closeResetDialog = () => {
  resetDialog.value = false;
  resetTarget.value = null;
  resetInput.value = '';
  resetResult.value = '';
};

const submitReset = () => {
  resetLoading.value = true;
  administrationUserStore.resetPassword(resetTarget.value.id, resetInput.value || null, (data) => {
    resetLoading.value = false;
    if (data.status === 'ok') {
      resetResult.value = data.password;
    }
  });
};

const copyPassword = () => {
  navigator.clipboard.writeText(resetResult.value);
};

const deleteItem = (item, force = false) => {
  deleteLoading[item.id] = true;
  administrationUserStore.deleteElement(force, item, function(data) {
    if (data.status == 'ko') {
      deleteDialog.value = true;
      element.value = { ...item, ...data.dependencies };
    } else {
      element.value = {};
      deleteDialog.value = false;
      administrationUserStore.initList();
    }
    deleteLoading[item.id] = false;
  });
};
</script>
