<template>
  <v-container v-if="show">
    <h2>Informazioni ordine: # {{ order.id }}</h2>
    <div class="table-box">
      <h3>Informazioni destinatario</h3>
      <table class="info-table">
        <tbody>
          <tr>
            <td class="label">
              Nome
            </td>
            <td>{{ order.addressee }}</td>
          </tr>
          <tr>
            <td class="label">
              Indirizzo
            </td>
            <td>{{ order.address }}</td>
          </tr>
          <tr>
            <td class="label">
              Recapito
            </td>
            <td>{{ order.addressee_contact ?? '/' }}</td>
          </tr>
          <tr>
            <td class="label">
              Punto vendita
            </td>
            <td>{{ order.user.nickname }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-box">
      <h3>Dettagli consegna</h3>
      <table class="info-table">
        <tbody>
          <tr>
            <td class="label">
              Data prevista consegna
            </td>
            <td>{{ order.dpc ?? '/' }}</td>
          </tr>
          <tr>
            <td class="label">
              Data richiesta consegna
            </td>
            <td>{{ order.drc ?? '/' }}</td>
          </tr>
          <tr>
            <td class="label">
              Data consegna effettiva
            </td>
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
            <th class="label">
              Prodotto
            </th>
            <th class="label">
              Servizi associati
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[productName, product] in Object.entries(order.products)"
            :key="productName"
          >
            <td>{{ productName }}</td>
            <td>
              <ul style="padding-left: 15px;">
                <li
                  v-for="(service, index) in product.services"
                  :key="index"
                >
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
      <h3 v-if="!orderUtils.LABELS.find(label => label.value == order.status).icon">
        Non consegnato
      </h3>
      <v-timeline
        v-else
        :direction="isMobile ? 'vertical' : 'horizontal'"
        :side="isMobile ? 'start' : 'end'"
      >
        <v-timeline-item
          v-for="(step, index) in orderUtils.LABELS.filter(label => !!label.icon)"
          :key="index"
          :dot-color="isStepCompleted(index) ? 'green' : 'grey lighten-1'"
        >
          <template #icon>
            <v-icon :size="18">
              {{ step.icon }}
            </v-icon>
          </template>
          <template #opposite>
            <p
              v-if="!isMobile"
              style="margin: 10px 0 -17px !important;"
            >
              {{ step.title }}
            </p>
            <p v-else>
              {{ step.title }}
            </p>
          </template>
        </v-timeline-item>
      </v-timeline>
    </div>
    <Map
      v-if="order.status === 'On Board'"
      :lat="order.lat"
      :lon="order.lon"
    />
  </v-container>
</template>

<script setup>
import Map from '@/components/OpenLayerMap';

import http from '@/utils/http';
import mobile from '@/utils/mobile';
import { ref, onMounted } from 'vue';
import orderUtils from '@/utils/order';
import { decodeId } from '@/utils/hashids';

const props = defineProps({ 
  orderId: {
    type: String,
    required: true
  }
});

const order = ref({});
const show = ref(false);
const orderIdNumeric = ref(null);
const isMobile = mobile.setupMobileUtils();

const isStepCompleted = (index) => {
  if (!order.value.status) return false;

  return index <= orderUtils.LABELS.findIndex(status => status.value === order.value.status);
};

onMounted(() => {
  const decoded = decodeId(props.orderId);
  if (decoded != null) {
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

.info-table td, th {
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
