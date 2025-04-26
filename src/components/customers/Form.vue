<template>
  <v-card title="Crea un nuovo Ordine" class="mt-10">
    <v-card-text>
      <v-form @submit.prevent="sendOrder">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-autocomplete
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.service_id"
              label="Servizio"
              :items="services"
              item-title="name"
              item-value="id"
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
        <v-btn
          type="submit"
          text="Invia"
          block
          :color="theme.current.value.primaryColor"
        />
      </v-form>
      <v-alert class="mt-10" v-if="message">
        Ordine completato con successo
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const message = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);
const { list: services } = storeToRefs(serviceStore);

const sendOrder = () => {
  orderStore.createElement(router, function (data) {
    if (data.status == 'ok')
      message.value = true;
  });
};
</script>