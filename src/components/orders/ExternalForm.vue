<template>
  <v-card
    title="Crea Ordine"
    :subtitle="flagForm ? `Punto Vendita: ${users.find(user => user.id == order.user_id).email}` : ''"
    class="mt-10"
    v-if="activeForm"
  >
    <v-card-text v-if="flagForm">
      <OrderForm @goBack="goBack" />
    </v-card-text>
    <v-card-text v-else>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-autocomplete
          v-model="order.user_id"
          label="Punto Vendita"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="email"
          item-value="id"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import OrderForm from '@/components/orders/Form';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const router = useRouter();
const loading = ref(false);
const flagForm = ref(false);
const orderStore = useOrderStore();
const administrationUserStore = useAdministrationUserStore();
administrationUserStore.initList(router);
const { list: users } = storeToRefs(administrationUserStore);
const { activeForm, element: order } = storeToRefs(orderStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  flagForm.value = true;
};

const goBack = () => {
  flagForm.value = false;
};
</script>
