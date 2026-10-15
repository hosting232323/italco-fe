<template>
  <v-card :title="`Cambia utente per l'ordine ${order.id}`">
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-autocomplete
          v-model="userId"
          label="Utente"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="nickname"
          item-value="id"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="emits('cancel')"
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
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const { order } = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const form = ref(null);
const message = ref('');
const userId = ref(null);
const loading = ref(false);
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const administrationUserStore = useAdministrationUserStore();

const { ready } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  http.makeRequest('order/customer', 'POST', {
    body: {
      order_id: order.id,
      user_id: userId.value
    }
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      ready.value = false;
      orderStore.initList();
      emits('cancel');
    } else
      message.value = data.message;
  });
};
</script>
