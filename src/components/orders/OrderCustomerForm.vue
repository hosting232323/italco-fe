<template>
  <v-form
    ref="form"
    @submit.prevent="submitForm"
  >
    <v-autocomplete
      v-model="selectedId"
      label="Punto Vendita"
      :items="users.filter(user => user.role == 'Customer')"
      item-title="nickname"
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
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const selectedId = ref(null);
const orderStore = useOrderStore();
const emits = defineEmits(['setSubtitle']);
const administrationUserStore = useAdministrationUserStore();
const { activeForm, element: order } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  order.value.user_id = selectedId.value;
  emits('setSubtitle', `Punto Vendita: ${users.value.find(user => user.id == selectedId.value).nickname}`);
};
</script>
