<template>
  <v-card title="Crea un nuovo Ordine" class="mt-10">
    <v-card-text>
      <v-form ref="form" @submit.prevent="sendOrder">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.service"
              label="Servizio"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="order.point_of_sale"
              label="Punto Vendita"
            />
          </v-col>
        </v-row>
        <v-btn type="submit" text="Invia" block />
      </v-form>
      <v-alert class="mt-10" v-if="message">
        Ordine completato con successo
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const message = ref(false);
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);

const sendOrder = () => {
  orderStore.createElement(function (data) {
    if (data.status == 'ok')
      message.value = true;
  });
};
</script>
