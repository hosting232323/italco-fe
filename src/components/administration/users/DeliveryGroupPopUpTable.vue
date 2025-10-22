<template>
  <v-data-table
    :items="deliveryGroup.users"
    :headers="[
      { title: 'Nickname', value: 'nickname' },
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
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const theme = useTheme();
const router = useRouter();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);
const deleteLoading = reactive({});

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  deliveryGroupStore.assignUser(item.id, router, function() {
    deliveryGroup.value.users = deliveryGroup.value.users.filter(user => user.id !== item.id);
    deliveryGroupStore.initList(router);
    deleteLoading[item.id] = false;
  }, true);
};
</script>
