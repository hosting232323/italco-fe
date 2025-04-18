<template>
  <v-card
    :title="`Modifica Ordine ${order.id}`"
    class="mt-10 mb-5"
    v-if="Object.keys(order).length > 0"
  >
    <v-card-text>
      <p class="mb-2">
        Servizio: {{ order.service }}
        Punto Vendita: {{ order.point_of_sale }}
      </p>
      <v-form @submit.prevent="updateOrder">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.note"
              label="Note"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :class="isMobile ? '' : 'ml-2'"
              :items="['Milan', 'Napoli', 'Inter']"
              v-model="order.group"
              label="Gruppo di consegna"
            />
          </v-col>
        </v-row>
        <v-btn type="submit" text="Invia" block />
      </v-form>
      <v-alert class="mt-10" v-if="message">
        Ordine aggiornato con successo
      </v-alert>
    </v-card-text>
  </v-card>
  <v-data-table
    :items="orders"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service' },
      { title: 'Punto Vendita', value: 'point_of_sale' },
      { title: 'Data', value: 'created_at' },
      { title: 'Stato', value: 'status' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        @click="openForm(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const message = ref(false);
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const { list: orders, element: order } = storeToRefs(orderStore);
orderStore.initList({status: 'Pending'});

const openForm = (item) => {
  order.value = item;
};

const updateOrder = () => {
  order.value.status = 'In Progress';
  orderStore.updateElement(function (data) {
    if (data.status == 'ok') {
      message.value = true;
      order.value = {};
    }
  });
}
</script>
