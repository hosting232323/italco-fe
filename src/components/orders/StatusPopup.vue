<template>
  <v-card title="Storico Stati">
    <v-data-table
      :items="statuses"
      :headers="[
        { title: 'Stato', value: 'status', sortable: false },
        { title: 'Data', value: 'date', sortable: false },
        { title: 'Ora', value: 'time', sortable: false }
      ]"
    >
      <template #[`item.status`]="{ item }">
        <v-chip :color="orderUtils.LABELS.find(label => label.value == item.status).color">
          {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
        </v-chip>
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
