<template>
  <v-container>
    <h1>Borderò</h1><hr>
    <ScheduleFilter />
    <v-skeleton-loader
      v-if="!ready"
      type="table"
      :color="theme.current.value.secondaryColor"
      class="mt-5"
    />
    <v-data-table
      v-else
      :items="schedules"
      :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
      :headers="[
        { title: 'ID', value: 'id', sortable: false },
        { title: 'Data', value: 'date', sortable: false },
        { title: 'Utenti Delivery', value: 'users', sortable: false },
        { title: 'Veicolo', key: 'transport.name', sortable: false },
        { title: 'Pianificazione', key: 'schedule_items', sortable: false },
        { title: 'Azioni', key: 'actions', sortable: false }
      ]"
    >
      <template #[`item.schedule_items`]="{ item }">
        <div
          v-for="scheduleItem in item.schedule_items.sort((a, b) => a.index - b.index)"
          :key="scheduleItem.index"
        >
          {{ scheduleItem.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
          ID: <b>{{ scheduleItem.operation_type == 'Order' ? scheduleItem.order_id : scheduleItem.collection_point_id }}</b>
          Indirizzo: <b>{{ scheduleItem.address }}</b>
        </div>
      </template>
      <template #[`item.users`]="{ item }">
        <div v-if="item.users && item.users.length">
          <span
            v-for="(user, index) in item.users"
            :key="index"
          >
            {{ user.nickname }}<span v-if="index < item.users.length - 1">, </span>
          </span>
        </div>
        <span v-else>-</span>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-row no-gutters>
          <v-col cols="4">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              :color="theme.current.value.primaryColor"
              @click="editElement(item)"
            />
          </v-col>
          <v-col cols="4">
            <v-btn
              icon="mdi-file-export"
              variant="text"
              :loading="!!exportLoading[item.id]"
              :color="theme.current.value.primaryColor"
              @click="exportElement(item)"
            />
          </v-col>
          <v-col cols="4">
            <v-btn
              icon="mdi-delete"
              variant="text"
              :loading="!!deleteLoading[item.id]"
              :color="theme.current.value.primaryColor"
              @click="deleteItem(item)"
            />
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
  <v-dialog
    v-model="dialog"
    max-width="1200"
  >
    <ScheduleForm @cancel="dialog = false" />
  </v-dialog>
</template>

<script setup>
import ScheduleForm from '@/components/operator/schedules/ScheduleForm';
import ScheduleFilter from '@/components/operator/schedules/ScheduleFilter';

import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const theme = useTheme();
const dialog = ref(false);
const router = useRouter();
const deleteLoading = reactive({});
const exportLoading = reactive({});

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const { ready, element: schedule } = storeToRefs(scheduleStore);
const schedules = storesUtils.getStoreList(scheduleStore, router);

const editElement = (item) => {
  schedule.value = item;
  dialog.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;

  scheduleStore.deleteElement(item, router, function() {
    orderStore.initList(router);
    scheduleStore.initList(router);
    deleteLoading[item.id] = false;
  });
};

const exportElement = async (item) => {
  exportLoading[item.id] = true;

  http.getRequest(`export/schedule/${item.id}`, {}, function (data) {
    exportLoading[item.id] = false;
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bordero_${item.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, 'GET', router, true);
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
