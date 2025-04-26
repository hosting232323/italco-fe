<template>
  <v-data-table
    :items="users"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
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
        v-if="item.role !== 'Admin'"
        icon="mdi-delete"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();
const router = useRouter();
const administrationUserStore = useAdministrationUserStore();
const { list: users } = storeToRefs(administrationUserStore);

const deleteItem = (item) => {
  administrationUserStore.deleteElement(item, router, function() {
    administrationUserStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
