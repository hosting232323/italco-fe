<template>
  <v-data-table
    :items="users"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nickname', value: 'email' },
      { title: 'Password', value: 'password' },
      { title: 'Ruolo', value: 'role' },
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
import { useAdministrationUserStore } from '@/stores/administrationUser';

const administrationUserStore = useAdministrationUserStore();
const { list: users } = storeToRefs(administrationUserStore);

const deleteItem = (item) => {
  administrationUserStore.deleteElement(item, function() {
    administrationUserStore.initList();
  });
};
</script>
