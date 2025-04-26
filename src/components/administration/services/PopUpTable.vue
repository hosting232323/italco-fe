<template>
  <v-data-table
    :items="service.users"
    :headers="[
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
        :color="theme.current.value.primaryColor"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const router = useRouter();
const serviceStore = useServiceStore();
const { element: service } = storeToRefs(serviceStore);

const deleteItem = (item) => {
  serviceStore.deleteServiceUserRelationships(item, router, function() {
    service.value.users = service.value.users.filter(user => user.id !== item.id);
    serviceStore.initList(router);
  });
};
</script>
