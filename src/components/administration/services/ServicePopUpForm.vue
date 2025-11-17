<template>
  <v-form
    v-if="activePopUpForm"
    ref="form"
    class="mb-5"
    @submit.prevent="submitForm"
  >
    <v-autocomplete
      v-model="serviceUser.user_id"
      label="Utente"
      :items="users.filter(user => user.role == 'Customer')"
      item-title="nickname"
      item-value="id"
      :rules="validation.requiredRules"
      :disabled="serviceUser.id"
    />
    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="serviceUser.code"
          :class="isMobile ? '' : 'mr-2'"
          label="Codice"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="serviceUser.price"
          type="number"
          :class="isMobile ? '' : 'ml-2'"
          append-icon="mdi-currency-eur"
          label="Prezzo"
          :rules="validation.requiredRules"
        />
      </v-col>
    </v-row>
    <FormButtons
      :loading="loading"
      @cancel="activePopUpForm = false"
    />
  </v-form>
  <v-alert
    v-if="message"
    class="mt-5 mb-5"
  >
    {{ message }}
  </v-alert>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useServiceStore } from '@/stores/service';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const message = ref('');
const loading = ref(false);
const router = useRouter();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);
const { innerElement: serviceUser, activePopUpForm } = storeToRefs(serviceStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  if (serviceUser.value.id)
    serviceStore.updateServiceUserRelationships(serviceUser.value, router, callback);
  else
    serviceStore.createServiceUserRelationships(serviceUser.value, router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok')
    serviceStore.initList(router);
  else
    message.value = data.error;
};
</script>
