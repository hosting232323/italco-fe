<template>
  <v-container>
    <h1>Borderò</h1><hr>
      <v-data-table
        :items="schedules"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="[
          { title: 'ID', value: 'id' },
          { title: 'Data', value: 'date' },
          { title: 'Gruppo Delivery', value: 'delivery_group.name' },
          { title: 'Veicolo', key: 'transport.name' },
          { title: 'Ordini', key: 'orders' },
          { title: 'Azioni', key: 'actions' }
        ]"
      >
        <template v-slot:item.orders="{ item }">
          <div v-for="order in item.orders">
            ID: <b>{{ order.id }}</b>
            Destinatario: <b>{{ order.addressee }}</b>
          </div>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row no-gutters>
            <v-col cols="6">
              <v-btn
                icon="mdi-delete"
                variant="text"
                :color="theme.current.value.primaryColor"
                @click="deleteItem(item)"
              />
            </v-col>
            <v-col cols="6">
              <v-btn
                icon="mdi-file-export"
                variant="text"
                :color="theme.current.value.primaryColor"
              />
            </v-col>
          </v-row>
        </template>
      </v-data-table>
  </v-container>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const theme = useTheme();
const router = useRouter();
const orderStore = useOrderStore();
const emits = defineEmits(['openPopUp']);
const scheduleStore = useScheduleStore();
const schedules = storesUtils.getStoreList(scheduleStore, router);

const deleteItem = (item) => {
  scheduleStore.deleteElement(item, router, function() {
    orderStore.initList(router);
    scheduleStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
