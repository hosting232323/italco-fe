<template>
  <v-card
    title="Crea Ordine"
    class="mt-10"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="sendOrder">
        <v-select
          v-model="order.type"
          label="Tipo"
          :items="orderUtils.TYPES"
          :rules="validation.requiredRules"
        />
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-select
              :class="isMobile ? '' : 'mr-2'"
              v-model="selectedService"
              label="Servizio"
              :items="services.filter(service => service.users.map(user => user.user_id).includes(order.user_id))"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
              menu
            >
              <template v-slot:item="{ props }">
                <v-list-item
                  v-bind="props"
                  @click="addService"
                />
              </template>
            </v-select>
            <v-chip
              class="mr-2 mb-2"
              v-for="(serviceId, index) in order.service_ids"
              closable
              @click:close="removeService(index)"
            >
              {{ services.find(service => service.id == serviceId).name }}
            </v-chip>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete multiple
              :class="isMobile ? '' : 'ml-2'"
              v-model="order.product_ids"
              label="Prodotto"
              :items="products"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-autocomplete
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.collection_point_id"
              label="Punto di Ritiro"
              :items="collectionPoints"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
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
              :rules="validation.requiredRules"
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
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="order.drc"
              label="Data Richiesta dal Cliente"
              type="date"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
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
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';

import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useAddresseeStore } from '@/stores/addressee';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const message = ref(false);
const router = useRouter();
const selectedService = ref(null);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const addresseeStore = useAddresseeStore();
const collectionPointStore = useCollectionPointStore();
const { element: order } = storeToRefs(orderStore);
const { list: services } = storeToRefs(serviceStore);
const { list: addressees } = storeToRefs(addresseeStore);
const { list: collectionPoints } = storeToRefs(collectionPointStore);

const addService = () => {
  if (!order.value.service_ids)
    order.value.service_ids = [];
  order.value.service_ids.push(selectedService.value);
};

const removeService = (index) => {
  order.value.service_ids.splice(index, 1);
};

const sendOrder = async () => {
  if (!(await form.value.validate()).valid) return;

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