<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-autocomplete
      v-model="selectedId"
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
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const loading = ref(false);
const selectedId = ref(null);
const orderStore = useOrderStore();
const administrationUserStore = useAdministrationUserStore();
const { list: users } = storeToRefs(administrationUserStore);
const { activeForm, element: order } = storeToRefs(orderStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  subtitle.value = `Punto Vendita: ${users.value.find(user => user.id == selectedId.value).email}`;
  order.value.user_id = selectedId.value;
};
</script>
