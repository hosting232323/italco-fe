<template>
  <v-data-table
    :items="service.users"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nickname', value: 'email' },
      { title: 'Price', value: 'price' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
const { element: service } = storeToRefs(serviceStore);

const deleteItem = (item) => {
  serviceStore.deleteServiceUserRelationships(item, function() {
    service.value.users = service.value.users.filter(user => user.id !== item.id);
    serviceStore.initList();
  });
};
</script>
