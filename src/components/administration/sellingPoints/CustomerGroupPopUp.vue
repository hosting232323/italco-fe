<template>
  <v-card
    title="Utenti associati"
    :subtitle="`GDO: ${customerGroup.name}`"
  >
    <template v-slot:append>
      <v-btn
        icon="mdi-plus"
        @click="formFlag = true"
        variant="text"
      />
    </template>
    <v-card-text>
      <PopUpForm v-if="formFlag" @closeForm="formFlag = false" />
      <PopUpTable v-if="customerGroup.users.length > 0" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import PopUpForm from '@/components/administration/sellingPoints/CustomerGroupPopUpForm';
import PopUpTable from '@/components/administration/sellingPoints/CustomerGroupPopUpTable';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';

const formFlag = ref(false);
const customerGroupStore = useCustomerGroupStore();
const { element: customerGroup } = storeToRefs(customerGroupStore);
</script>
