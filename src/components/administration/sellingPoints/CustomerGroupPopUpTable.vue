<template>
  <SelectionTable
    :items="customerGroup.users"
    :headers="[
      { title: 'Nickname', value: 'nickname', sortable: false }
    ]"
  >
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-delete"
        text="Elimina"
        variant="text"
        :loading="deleteLoading[item.id]"
        @click="deleteItem(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';

const deleteLoading = reactive({});

const customerGroupStore = useCustomerGroupStore();
const { element: customerGroup } = storeToRefs(customerGroupStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerGroupStore.assignUser(item.id, function() {
    customerGroupStore.initList();
    customerGroup.value.users = customerGroup.value.users.filter(
      user => user.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
