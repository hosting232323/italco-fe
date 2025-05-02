<template>
  <v-btn
    icon="mdi-pencil"
    variant="text"
    :color="theme.current.value.primaryColor"
    @click="openForm(item)"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const orderStore = useOrderStore();
const props = defineProps(['item']);
const { element: order, activeSecondForm } = storeToRefs(orderStore);

const openForm = (item) => {
  order.value = item;
  activeSecondForm.value = true;
};
</script>
