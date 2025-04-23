<template>
  <v-card
    title="Utenti associati"
    :subtitle="`Servizio: ${service.name}`"
    class="mt-10 mb-5"
  >
    <template v-slot:append>
      <v-btn
        icon="mdi-plus"
        @click="formFlag = true"
        variant="text"
      />
    </template>
    <v-card-text>
      <PopUpForm v-if="formFlag" @closeForm="closeForm" />
      <PopUpTable v-if="service.users.length > 0" />
      <template v-else-if="!formFlag">
        <v-form @submit.prevent="submitForm">
          <v-text-field
            type="number"
            prepend-icon="mdi-currency-eur"
            v-model="price"
            label="Prezzo"
          />
          <v-btn text="Associa tutti gli utenti" type="submit" block />
        </v-form>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import PopUpForm from '@/components/administration/services/PopUpForm';
import PopUpTable from '@/components/administration/services/PopUpTable';

import { ref } from 'vue';
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const price = ref(null);
const formFlag = ref(false);
const serviceStore = useServiceStore();
const { element: service } = storeToRefs(serviceStore);

const closeForm = () => {
  formFlag.value = false;
};

const submitForm = () => {
  http.getRequest('service/set-all-users', {
    service_id: service.value.id,
    price: price.value,
  }, function (data) {
    if (data.status == 'ok') {
      service.value.users = data.service_users;
      serviceStore.initList();
    }
  })
};
</script>
