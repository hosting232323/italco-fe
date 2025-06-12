<template>
  <v-dialog max-width="1500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            variant="text"
            icon="mdi-file-export"
            :loading="loading"
            :color="theme.current.value.primaryColor"
            @click="exportPdf(item)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-truck-delivery"
            variant="text"
            :color="theme.current.value.primaryColor"
            v-bind="activatorProps"
            @click="order = item"
          />
        </v-col>
      </v-row>
    </template>
    <template v-slot:default>
      <v-card :title="`Situazione delivery ordine ${order.id}`">
        <v-card-text>
          Motivazione: {{ order.motivation }}<br>
          <div v-if="order.photos && order.photos.length">
            <v-img
              v-for="photo in order.photos"
              :src="`${http.hostname}order/photo/${photo}`"
              max-width="1500"
              max-height="1000"
              class="mt-4"
            />
          </div>
          <div v-else>
            Nessuna immagine disponibile.
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';

const order = ref({});
const theme = useTheme();
const router = useRouter();
const loading = ref(false);
const orderStore = useOrderStore();
const props = defineProps(['item']);
const { element: updatedOrder, activeForm } = storeToRefs(orderStore);

const openForm = (item) => {
  updatedOrder.value = item;
  updatedOrder.value.user_id = updatedOrder.value.user.id;
  Object.keys(updatedOrder.value.products).forEach(
    product => updatedOrder.value.products[product] = updatedOrder.value.products[product].map(
      service => service.id
    )
  );
  activeForm.value = true;
};

const exportPdf = async (item) => {
  loading.value = true;

  http.getRequest(`export/order/${item.id}`, {}, function (data) {
    loading.value = false;
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordine_${item.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, 'GET', router, true)
};
</script>
