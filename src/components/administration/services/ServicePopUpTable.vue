<template>
  <v-data-table
    :items="service.users"
    :headers="[
      { title: 'Nickname', value: 'nickname' },
      { title: 'Price', value: 'price' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        :loading="deleteLoading[item.id]"
        :color="theme.current.value.primaryColor"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const router = useRouter();
const serviceStore = useServiceStore();
const { element: service } = storeToRefs(serviceStore);
const deleteLoading = reactive({});

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  serviceStore.deleteServiceUserRelationships(item, router, function() {
    service.value.users = service.value.users.filter(user => user.id !== item.id);
    serviceStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>
