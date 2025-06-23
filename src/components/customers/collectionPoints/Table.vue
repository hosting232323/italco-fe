<template>
  <v-data-table
    :items="collectionPoints"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nominativo', value: 'name' },
      { title: 'Indirizzo', value: 'address' },
      { title: 'Città', value: 'city' },
      { title: 'Cap', value: 'cap' },
      { title: 'Provincia', value: 'province' },
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
import { useCollectionPointStore } from '@/stores/collectionPoint';

const theme = useTheme();
const router = useRouter();
const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm } = storeToRefs(collectionPointStore);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const openForm = (item) => {
  collectionPoint.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  collectionPointStore.deleteElement(item, router, function() {
    collectionPointStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
