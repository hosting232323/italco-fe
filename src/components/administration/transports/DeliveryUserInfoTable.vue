<template>
  <SelectionTable
    :ready="ready"
    :items="users.filter(user => user.role == 'Delivery')"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Località', value: 'cap', sortable: false }
    ]"
  >
    <template #[`item.cap`]="{ item }">
      {{ item.delivery_user_info ? addressUtils.getCityByCap(item.delivery_user_info.cap) : '' }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import addressUtils from '@/utils/address';
import { useAdministrationUserStore } from '@/stores/administrationUser';


const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm, ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

const openForm = (item) => {
  user.value = item;
  activeForm.value = true;

  document.getElementById('delivery-form')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
</script>
