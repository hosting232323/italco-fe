<template>
  <v-card
    title="Email per le anomalie"
    subtitle="Ricevono le email per ordini non consegnati, da rischedulare, in ritardo o con anomalia."
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitMails"
      >
        <v-combobox
          v-model="mails"
          label="Email dell'attività"
          multiple
          chips
          closable-chips
          :delimiters="[',', ' ', ';']"
          :rules="[mailsRule]"
          hint="Scrivi un indirizzo e premi invio"
          persistent-hint
        />
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-2"
        >
          {{ error }}
        </v-alert>
        <v-btn
          class="mt-4"
          type="submit"
          text="Salva"
          :loading="loading"
          :color="theme.current.value.primaryColor"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import http from '@/utils/http';
import { ref, onMounted } from 'vue';
import { useTheme } from 'vuetify';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const theme = useTheme();
const form = ref(null);
const mails = ref([]);
const loading = ref(false);
const error = ref('');

const mailsRule = (value) => {
  const invalid = value.filter(mail => !EMAIL_REGEX.test(mail.trim()));
  return invalid.length === 0 || `Email non valida: ${invalid.join(', ')}`;
};

onMounted(() => {
  http.makeRequest('company/mail', 'GET', {}, (data) => {
    mails.value = data.mails;
  });
});

const submitMails = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  error.value = '';
  http.makeRequest('company/mail', 'PUT', { body: { mails: mails.value } }, (data) => {
    loading.value = false;
    if (data.status == 'ok')
      mails.value = data.mails;
    else
      error.value = data.message || 'Errore durante il salvataggio delle email';
  });
};
</script>
