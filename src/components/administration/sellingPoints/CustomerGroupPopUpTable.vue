<template>
  <v-data-table
    :items="customerGroup.users"
    :headers="[
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
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
import { useCustomerGroupStore } from '@/stores/customerGroup';

const theme = useTheme();
const router = useRouter();
const customerGroupStore = useCustomerGroupStore();
const { element: customerGroup } = storeToRefs(customerGroupStore);
const deleteLoading = reactive({});

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerGroupStore.assignUser(item.id, router, function() {
    customerGroupStore.initList(router);
    customerGroup.value.users = customerGroup.value.users.filter(
      user => user.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
