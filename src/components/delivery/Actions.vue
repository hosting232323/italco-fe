<template>
  <v-row no-gutters v-if="!['Completed', 'Cancelled', 'Anomaly'].includes(item.status)">
    <v-col cols="6">
      <v-btn
        icon="mdi-check-circle"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item, 'Completed')"
      />
    </v-col>
    <v-col cols="6">
      <v-btn
        icon="mdi-clock-time-five"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item, 'Delay')"
      />
    </v-col>
    <v-col cols="6">
      <v-btn
        icon="mdi-close-circle"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item, 'Cancelled')"
      />
    </v-col>
    <v-col cols="6">
      <v-btn
        icon="mdi-alert-circle"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item, 'Anomaly')"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const orderStore = useOrderStore();
const props = defineProps(['item']);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = (item, status) => {
  order.value = item;
  order.value.status = status;
  order.value.user_id = order.value.user.id;
  order.value.service_ids = order.value.services.map((service) => service.id);
  activeForm.value = true;
};
</script>
