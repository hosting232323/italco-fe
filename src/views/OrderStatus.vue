<template>
  <v-container v-if="show">
    <h2>Informazioni ordine: # {{ order.id }}</h2>

    <div class="table-wrapper">
      <div class="table-box">
        <h3>Punto vendita</h3>
        <table class="info-table">
          <tbody>
            <tr>
              <td class="label">Nome</td>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <td class="label">Punto di ritiro</td>
              <td>
                {{ order.collection_point.name }}<br>
                {{ order.collection_point.address }}<br>
                {{ order.collection_point.city }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="table-box">
        <h3>Destinatario</h3>
        <table class="info-table">
          <tbody>
            <tr>
              <td class="label">Nome</td>
              <td>{{ order.addressee }}</td>
            </tr>
            <tr>
              <td class="label">Indirizzo</td>
              <td>{{ order.address }}</td>
            </tr>
            <tr>
              <td class="label">Recapito</td>
              <td>{{ order.addressee_contact ?? '/' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="table-box">
      <h3>Dettagli consegna</h3>
      <table class="info-table">
        <tbody>
          <tr>
            <td class="label">Data prevista consegna</td>
            <td>{{ order.dpc ?? '/' }}</td>
          </tr>
          <tr>
            <td class="label">Data richiesta consegna</td>
            <td>{{ order.drc ?? '/' }}</td>
          </tr>
          <tr>
            <td class="label">Data consegna effettiva</td>
            <td>{{ order.booking_date ?? '/' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-box">
      <h3>Prodotti e Servizi</h3>
      <table class="info-table">
        <thead>
          <tr>
            <th class="label">Prodotto</th>
            <th class="label">Servizi associati</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(services, product_name) in order.products" :key="product_name">
            <td>{{ product_name }}</td>
            <td>
              <ul style="padding-left: 15px;">
                <li v-for="(service, index) in services" :key="index">
                  {{ service.name }} - {{ service.type }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-box">
      <h3>Stato Ordine</h3>
      <v-timeline :direction="isMobile ? 'vertical' : 'horizontal'" :side="isMobile ? 'start' : 'end'">
        <v-timeline-item
          v-for="step in orderHistory"
          :key="step.id"
          :dot-color="isStepCompleted(step) ? 'green' : 'grey lighten-1'"
        >
          <template v-slot:icon>
            <v-icon :size="18">{{ step.icon }}</v-icon>
          </template>
          <template v-slot:opposite>
            <p style="margin: 10px 0 -17px !important;" v-if="!isMobile">
              {{ step.label }}
            </p>
            <p v-else>
              {{ step.label }}
            </p>
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>

    <Map v-if="order.status === 'On Board'" :lat="order.lat" :lon="order.lon" />
  </v-container>
</template>

<script setup>
import Map from '@/components/Map.vue';
import mobile from '@/utils/mobile';

import http from '@/utils/http';
import { ref, onMounted } from 'vue';
import { decodeId } from '@/utils/hashids';

const props = defineProps({ orderId: String });
const isMobile = mobile.setupMobileUtils();

const order = ref({});
const show = ref(false);
const orderIdNumeric = ref(null);

const orderHistory = [
  { id: 0, label: 'Pending', icon: 'mdi-timer-sand' },
  { id: 1, label: 'In Progress', icon: 'mdi-progress-clock' },
  { id: 2, label: 'On Board', icon: 'mdi-truck-delivery' },
  { id: 3, label: 'Completed', icon: 'mdi-check-circle-outline' }
];

function isStepCompleted(step) {
  if (!order.value.status) return false;
  return step.id <= orderHistory.findIndex(s => s.label === order.value.status);
}

onMounted(() => {
  const decoded = decodeId(props.orderId);
  if (decoded === null) {
    console.error('ID ordine non valido o corrotto');
  } else {
    orderIdNumeric.value = decoded;
    http.getRequest(`order/${orderIdNumeric.value}`, {}, (data) => {
      if (data.status === 'ok') {
        order.value = data.order;
        show.value = true;
      }
    }, 'GET');
  }
});
</script>

<style scoped>
.table-wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.table-box {
  border-radius: 8px;
  padding: 16px;
  flex: 1;
  min-width: 300px;
}

h3 {
  margin: 0 0 10px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td,
th {
  padding: 12px 15px;
  border: 1px solid #ccc;
  background-color: #fafafa;
}

.info-table .label {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 30%;
}

</style>
