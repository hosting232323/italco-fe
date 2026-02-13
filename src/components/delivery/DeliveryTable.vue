<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-data-table
        v-if="ready"
        class="mt-5"
        :items="filteredOrders"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="[
          { title: 'ID', value: 'id', sortable: false },
          { title: 'Tipo', value: 'type', sortable: false },
          { title: 'Prodotti e Servizi', value: 'productsServices', sortable: false },
          { title: 'Prodotti e Punti di Ritiro', value: 'productsCollectionPoint', sortable: false },
          { title: 'Punto Vendita', value: 'user.nickname', sortable: false },
          { title: 'Destinatario', value: 'addressee', sortable: false },
          { title: 'Recapito', value: 'addressee_contact', sortable: false },
          { title: 'Note Punto Vendita', value: 'customer_note', sortable: false },
          { title: 'Note Operatori', value: 'operator_note', sortable: false },
          { title: 'Azioni', key: 'actions', sortable: false }
        ]"
      >
        <template #[`item.type`]="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template #[`item.productsServices`]="{ item }">
          <template
            v-for="[productName, product] in Object.entries(item.products)"
            :key="productName"
          >
            <p>
              <b>{{ productName }}</b>:
              {{ product.services.map(service => service.name).join(', ') }}
            </p>
          </template>
        </template>
        <template #[`item.productsCollectionPoint`]="{ item }">
          <template
            v-for="[productName, product] in Object.entries(item.products)"
            :key="productName"
          >
            <b>{{ productName }}</b>
            <p style="font-size: smaller;">
              Punto di Ritiro: {{ product.collection_point?.name }},
              {{ product.collection_point?.address }}, {{ product.collection_point?.cap }}
            </p>
          </template>
        </template>
        <template #[`item.addressee`]="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">
            {{ item.address }}, {{ item.cap }}
          </p>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="order = item; dialog = true"
          />
        </template>
      </v-data-table>
    </template>
    <template #default>
      <Form @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useOrderStore } from '@/stores/order';
import Form from '@/components/delivery/DeliveryForm';

const { keyName } = defineProps({
  keyName: {
    type: String,
    required: true
  }
});

const theme = useTheme();
const dialog = ref(false);
const orderStore = useOrderStore();
const { list: orders, element: order, ready } = storeToRefs(orderStore);

const filteredOrders = computed(() => {
  let result = [];
  if (keyName === 'Anomaly')
    result = [...(orders.value['Confirmed'] || []), ...(orders.value['Booking'] || [])].filter(o => o.anomaly);
  else if (keyName === 'Delay')
    result = [...(orders.value['Confirmed'] || []), ...(orders.value['Booking'] || [])].filter(o => o.delay);
  else
    result = orders.value?.[keyName] || [];
  return result.slice().sort((a, b) => a.schedule_index - b.schedule_index);
});
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
