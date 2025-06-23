<template>
  <v-data-table
    :items="customerRules"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Utente', value: 'email' },
      { title: 'Regole', value: 'rules' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.rules="{ item }">
      <div v-for="(rules, index) in item.rules" :key="index">
        <b>{{ rules.day_of_week }}</b>: {{ rules.max_orders }}
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
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
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useCustomerRuleStore } from '@/stores/customerRule';

const theme = useTheme();
const router = useRouter();
const customerRuleStore = useCustomerRuleStore();
const customerRules = storesUtils.getStoreList(customerRuleStore, router);

const deleteItem = (item) => {
  customerRuleStore.deleteElements(item.rules.map(rule => rule.id), router, function() {
    customerRuleStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
