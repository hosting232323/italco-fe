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
            <v-autocomplete
              :class="isMobile ? '' : 'ml-2'"
              v-model="order.addressee_id"
              label="Anagrafica"
              :items="addressees"
              item-title="name"
              item-value="id"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.dpc"
              label="Data Promessa al Cliente"
              type="date"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="order.drc"
              label="Data Richiesta dal Cliente"
              type="date"
            />
          </v-col>
        </v-row>
        <v-autocomplete
          v-model="order.collection_point_id"
          label="Punto di Ritiro"
          :items="collectionPoints"
          item-title="name"
          item-value="id"
        />
        <v-textarea
          v-model="order.customer_note"
          label="Note"
          rows="3"
        />
        <v-btn
          type="submit"
          text="Invia"
          block
          :color="theme.current.value.primaryColor"
          :loading="loading"
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
import { useAddresseeStore } from '@/stores/addressees';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const theme = useTheme();
const loading = ref(false);
const message = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const addresseeStore = useAddresseeStore();
const collectionPointStore = useCollectionPointStore();
const { element: order } = storeToRefs(orderStore);
const { list: services } = storeToRefs(serviceStore);
const { list: addressees } = storeToRefs(addresseeStore);
const { list: collectionPoints } = storeToRefs(collectionPointStore);

const sendOrder = () => {
  loading.value = true;
  orderStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      message.value = true;
      order.value = {};
    }
  });
};
</script>