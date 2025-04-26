<template>
  <v-card
    title="Crea Gruppo Delivery"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="deliveryGroup.name"
          label="Nome"
        />
        <FormButtons @cancel="activeForm = false" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const router = useRouter();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup, activeForm } = storeToRefs(deliveryGroupStore);

const submitForm = () => {
  deliveryGroupStore.createElement(router, function (data) {
    if (data.status == 'ok') {
      deliveryGroupStore.initList(router);
      deliveryGroup.value = {};
      activeForm.value = false;
    }
  });
};
</script>
