<template>
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
      @cancel="emits('closeForm');"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const userId = ref(null);
const loading = ref(false);
const emits = defineEmits(['closeForm']);
const customerGroupStore = useCustomerGroupStore();
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore);
const { element: customerGroup } = storeToRefs(customerGroupStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  customerGroupStore.assignUser(userId.value, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      customerGroupStore.initList();
      customerGroup.value.users.push(data.user);
      emits('closeForm');
    }
  });
};
</script>
