<template>
  <v-card
    title="Utenti associati"
    :subtitle="`Gruppo Delivery: ${deliveryGroup.name}`"
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
      <PopUpTable v-if="deliveryGroup.users.length > 0" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import PopUpForm from '@/components/administration/users/DeliveryGroupPopUpForm';
import PopUpTable from '@/components/administration/users/DeliveryGroupPopUpTable';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const formFlag = ref(false);
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);
</script>
