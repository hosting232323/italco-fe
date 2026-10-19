<template>
  <SelectionTable
    :ready="ready"
    :items="customerRules"
    :headers="[
      { title: 'Utente', value: 'nickname', sortable: false },
      { title: 'Regole', value: 'rules', sortable: false }
    ]"
  >
    <template #[`item.rules`]="{ item }">
      <div
        v-for="(rules, index) in item.rules"
        :key="index"
      >
        <b>{{ days.getDayByValue(rules.day_of_week) }}</b>:
        {{ rules.max_orders }}
      </div>
    </template>
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
import days from '@/utils/days';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useCustomerRuleStore } from '@/stores/customerRule';

const deleteLoading = reactive({});

const customerRuleStore = useCustomerRuleStore();
const { ready } = storeToRefs(customerRuleStore);
const customerRules = storesUtils.getStoreList(customerRuleStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerRuleStore.deleteElements(item.rules.map(rule => rule.id), function() {
    customerRuleStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
