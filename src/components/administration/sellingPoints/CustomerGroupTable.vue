<template>
  <SelectionTable
    :ready="ready"
    :items="customerGroups"
    :headers="[
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Utenti', value: 'users', sortable: false }
    ]"
  >
    <template #[`item.users`]="{ item }">
      {{ item.users.map(user => user.nickname).join(', ') }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-account-group"
        text="Utenti"
        variant="text"
        @click="emits('openPopUp', item, 'customerGroup')"
      />
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
import storesUtils from '@/utils/stores';
import { useCustomerGroupStore } from '@/stores/customerGroup';

const deleteLoading = reactive({});
const emits = defineEmits(['openPopUp']);

const customerGroupStore = useCustomerGroupStore();
const { ready } = storeToRefs(customerGroupStore);
const customerGroups = storesUtils.getStoreList(customerGroupStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerGroupStore.deleteElement(item, function() {
    customerGroupStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
