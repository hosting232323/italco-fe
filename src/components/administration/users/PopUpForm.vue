<template>
  <v-form @submit.prevent="submitForm">
    <v-autocomplete
      v-model="userId"
      label="Utente"
      :items="users.filter(user => user.role == 'Delivery')"
      item-title="email"
      item-value="id"
    />
    <FormButtons
      :loading="loading"
      @cancel="emits('closeForm');"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const userId = ref(null);
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['closeForm']);
const deliveryGroupStore = useDeliveryGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { list: users } = storeToRefs(administrationUserStore);
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);

const submitForm = () => {
  loading.value = true;
  deliveryGroupStore.assignUser(userId.value, router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      deliveryGroupStore.initList(router);
      deliveryGroup.value.users.push(data.user);
      emits('closeForm');
    }
  });
};
</script>
