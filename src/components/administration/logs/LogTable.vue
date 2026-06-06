<template>
  <v-data-table
    v-if="ready"
    :items="logs"
    :headers="[
      { title: 'Data', value: 'logs.created_at', sortable: false },
      { title: 'Ora', value: 'logs.created_at', key: 'time', sortable: false },
      { title: 'User', value: 'user.nickname', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.logs.created_at`]="{ item }">
      {{ item.logs.created_at?.split('T')[0] }}
    </template>

    <template #[`item.time`]="{ item }">
      {{ item.logs.created_at?.split('T')[1]?.split('.')[0] }}
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
