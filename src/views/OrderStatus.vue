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
    <v-timeline direction="horizontal">
      <v-timeline-item
        v-for="step in orderHistory"
        :key="step.id"
        :color="isStepCompleted(step) ? 'green' : 'grey lighten-1'"
        :fill-dot="isStepCompleted(step)"
      >
        <template v-slot:opposite>
          {{ step.label }}
        </template>
      </v-timeline-item>
    </v-timeline>
    </div>


  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { decodeId } from '@/utils/hashids';
import http from '@/utils/http';

const props = defineProps({
  orderId: String,
});

const order = ref({});
const show = ref(false);
const orderIdNumeric = ref(null);

const orderHistory = [
  { id: 0, label: 'Pending' },
  { id: 1, label: 'In Progress' },
  { id: 2, label: 'On Board' },
  { id: 3, label: 'Completed' }
];

function isStepCompleted(step) {
  if (!order.value.status) return false;
  const currentIndex = orderHistory.findIndex(s => s.label === order.value.status);
  return step.id <= currentIndex + 1;
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
