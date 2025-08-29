<template>
  <v-data-table
    :items="customerGroups"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Nome', value: 'name' },
      { title: 'Utenti', value: 'users' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.users="{ item }">
      {{ item.users.map(user => user.email).join(', ') }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-account-group"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'customerGroup')"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :loading="deleteLoading[item.id]"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useCustomerGroupStore } from '@/stores/customerGroup';

const theme = useTheme();
const router = useRouter();
const emits = defineEmits(['openPopUp']);
const customerGroupStore = useCustomerGroupStore();
const customerGroups = storesUtils.getStoreList(customerGroupStore, router);
const deleteLoading = reactive({});

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerGroupStore.deleteElement(item, router, function() {
    customerGroupStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
