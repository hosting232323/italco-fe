<template>
  <v-card title="Storico Ordine">
    <v-data-table
      :items="statuses"
      :headers="[
        { title: 'Stato', value: 'status', sortable: false },
        { title: 'Data', value: 'date', sortable: false },
        { title: 'Ora', value: 'time', sortable: false }
      ]"
    >
      <template #[`item.status`]="{ item }">
        <v-chip
          v-if="item.status"
          :color="orderUtils.LABELS.find(label => label.value == item.status).color"
        >
          {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
        </v-chip>
        <div v-else-if="item.hasOwnProperty('anomaly')">
          <v-icon :color="item.anomaly ? 'red' : 'green'" class="me-1">
            {{ item.anomaly ? 'mdi-alert-outline' : 'mdi-alert-remove-outline' }}
          </v-icon>
          Anomalia
        </div>
        <div v-else-if="item.hasOwnProperty('delay')">
          <v-icon :color="item.delay ? 'orange' : 'blue'" class="me-1">
            {{ item.delay ? 'mdi-clock-alert-outline' : 'mdi-clock-outline' }}
          </v-icon>
          Ritardo
        </div>
        <div v-else-if="item.hasOwnProperty('confirmed')" class="d-flex align-center">
          <div :style="{width: '15px', height: '15px', borderRadius: '50%', marginRight: '8px' ,backgroundColor: item.confirmed ? 'green' : 'red'}"></div>
          Confermato
        </div>
      </template>
      <template #[`item.date`]="{ item }">
        {{ item.created_at.split(' ')[0] }}
      </template>
      <template #[`item.time`]="{ item }">
        {{ item.created_at.split(' ')[1] }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import orderUtils from '@/utils/order';

const { statuses } = defineProps({
  statuses: {
    type: Array,
    required: true
  }
});
</script>
