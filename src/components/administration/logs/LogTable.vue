<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="logs"
    :headers="[
      { title: 'Data', value: 'logs.created_at', sortable: false },
      { title: 'Metodo', value: 'logs.method', sortable: false },
      { title: 'Endpoint', value: 'logs.endpoint', sortable: false },
      { title: 'User', value: 'user.nickname', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.logs.created_at`]="{ item }">
      {{ days.formatDateTime(item.logs.created_at) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-magnify-plus-outline"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item.logs)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useLogStore } from '@/stores/log';

const theme = useTheme();
const router = useRouter();
const logStore = useLogStore();
const { ready, activePopUp, selectedLog } = storeToRefs(logStore);
const logs = storesUtils.getStoreList(logStore, router);

const openForm = (item) => {
  selectedLog.value = item.id;
  activePopUp.value = true;
};
</script>
