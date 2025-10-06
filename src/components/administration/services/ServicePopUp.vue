<template>
  <v-card
    title="Utenti associati"
    :subtitle="`Servizio: ${service.name}`"
    class="mt-10 mb-5"
  >
    <template #append>
      <v-btn
        icon="mdi-plus"
        variant="text"
        @click="formFlag = true"
      />
    </template>
    <v-card-text>
      <PopUpForm
        v-if="formFlag"
        @close-form="formFlag = false"
      />
      <PopUpTable v-if="service.users.length > 0" />
      <template v-else-if="!formFlag">
        <v-form
          ref="form"
          @submit.prevent="submitForm"
        >
          <v-text-field
            v-model="price"
            type="number"
            prepend-icon="mdi-currency-eur"
            label="Prezzo"
            :rules="validation.requiredRules"
          />
          <v-btn
            text="Associa tutti gli utenti"
            type="submit"
            block
            :color="theme.current.value.primaryColor"
            :loading="loading"
          />
        </v-form>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import PopUpForm from '@/components/administration/services/ServicePopUpForm';
import PopUpTable from '@/components/administration/services/ServicePopUpTable';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useServiceStore } from '@/stores/service';

const form = ref(null);
const price = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const formFlag = ref(false);
const serviceStore = useServiceStore();
const { element: service } = storeToRefs(serviceStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.getRequest('service/set-all-users', {
    service_id: service.value.id,
    price: price.value,
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      service.value.users = data.service_users;
      serviceStore.initList(router);
    }
  }, 'GET', router);
};
</script>
