<template>
  <v-data-table
    :items="deliveryGroups"
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
            v-if="item.role !== 'Admin'"
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-account-group"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deliveryGroup = item"
            v-bind="activatorProps"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const theme = useTheme();
const router = useRouter();
const props = defineProps(['activatorProps']);
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);
const deliveryGroups = storesUtils.getStoresList(deliveryGroupStore, router)

const deleteItem = (item) => {
  deliveryGroupStore.deleteElement(item, router, function() {
    deliveryGroupStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
