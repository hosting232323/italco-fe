<template>
  <v-data-table
    :items="deliveryGroup.users"
    :headers="[
      { title: 'Nickname', value: 'email' },
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
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const theme = useTheme();
const router = useRouter();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);

const deleteItem = (item) => {
  deliveryGroupStore.assignUser(item.id, router, function() {
    deliveryGroup.value.users = deliveryGroup.value.users.filter(user => user.id !== item.id);
    deliveryGroupStore.initList(router);
  }, true);
};
</script>
