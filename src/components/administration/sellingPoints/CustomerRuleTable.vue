<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="customerRules"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Utente', value: 'nickname', sortable: false },
      { title: 'Regole', value: 'rules', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
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
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        :loading="deleteLoading[item.id]"
        :color="theme.current.value.primaryColor"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useCustomerRuleStore } from '@/stores/customerRule';

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});

const customerRuleStore = useCustomerRuleStore();
const { ready } = storeToRefs(customerRuleStore);
const customerRules = storesUtils.getStoreList(customerRuleStore, router);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  customerRuleStore.deleteElements(item.rules.map(rule => rule.id), router, function() {
    customerRuleStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
