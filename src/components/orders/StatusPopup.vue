<template>
  <v-card title="Storico Stati">
    <v-data-table
      :items="statuses"
      :headers="[
        { title: 'Tipo/Status', value: 'status', sortable: false },
        { title: 'Data', value: 'date', sortable: false },
        { title: 'Ora', value: 'time', sortable: false }
      ]"
    >
      <template #[`item.status`]="{ item }">
        <template v-if="item.status">
          <v-chip :color="orderUtils.LABELS.find(label => label.value == item.status).color">
            {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
          </v-chip>
        </template>
        <template v-else>
            {{ formatOtherStatus(item) }}
        </template>
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

const formatOtherStatus = (item) => {
  const keys = Object.keys(item).filter(
    k => !['id', 'order_id', 'created_at', 'updated_at', 'status'].includes(k)
  );
  
  if (keys.length) {
    return `${keys[0]}: ${item[keys[0]]}`;
  }
  return '';
};
</script>
