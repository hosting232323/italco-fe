<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="collectionPoints"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nominativo', value: 'name' },
      { title: 'Indirizzo', value: 'address' },
      { title: 'Cap', value: 'cap' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template #[`item.actions`]="{ item }">
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
            :loading="deleteLoading[item.id]"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const theme = useTheme();
const router = useRouter();
const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm, ready } = storeToRefs(collectionPointStore);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);
const deleteLoading = reactive({});

const openForm = (item) => {
  collectionPoint.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  collectionPointStore.deleteElement(item, router, function() {
    collectionPointStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
