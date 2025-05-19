<template>
  <v-data-table
    :items="customerGroup.users"
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
import { useCustomerGroupStore } from '@/stores/customerGroup';

const theme = useTheme();
const router = useRouter();
const customerGroupStore = useCustomerGroupStore();
const { element: customerGroup } = storeToRefs(customerGroupStore);

const deleteItem = (item) => {
  customerGroupStore.assignUser(item.id, router, function() {
    customerGroup.value.users = customerGroup.value.users.filter(user => user.id !== item.id);
    customerGroupStore.initList(router);
  }, true);
};
</script>
