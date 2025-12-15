<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="users.filter(user => user.role == 'Delivery')"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Località', value: 'delivery_user_info.location', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();
const router = useRouter();
const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm, ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const openForm = (item) => {
  user.value = item;
  activeForm.value = true;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
