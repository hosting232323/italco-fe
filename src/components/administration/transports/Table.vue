<template>
  <v-data-table
    :items="transports"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Targa', value: 'plate' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';

const theme = useTheme();
const router = useRouter();
const transportStore = useTransportStore();
const { element: transport, activeForm } = storeToRefs(transportStore);
const transports = storesUtils.getStoreList(transportStore, router);

const openForm = (item) => {
  transport.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  transportStore.deleteElement(item, router, function() {
    transportStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
