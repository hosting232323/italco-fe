<template>
  <SelectionTable
    :ready="ready"
    :items="users.filter(user => user.role == 'Customer')"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Codice Importazioni', value: 'import_code', sortable: false },
      { title: 'Città', value: 'city', sortable: false },
      { title: 'Indirizzo', value: 'address', sortable: false },
      { title: 'Codice Fiscale', value: 'tax_code', sortable: false },
      { title: 'Ragione Sociale', value: 'company_name', sortable: false },
      { title: 'Email', value: 'email', sortable: false },
      { title: 'Codice Distribuzione RAEE', value: 'rae_code', sortable: false }
    ]"
  >
    <template #[`item.import_code`]="{ item }">
      {{ item.customer_user_info?.import_code }}
    </template>
    <template #[`item.city`]="{ item }">
      {{ item.customer_user_info?.city }}
    </template>
    <template #[`item.address`]="{ item }">
      {{ item.customer_user_info?.address }}
    </template>
    <template #[`item.tax_code`]="{ item }">
      {{ item.customer_user_info?.tax_code }}
    </template>
    <template #[`item.company_name`]="{ item }">
      {{ item.customer_user_info?.company_name }}
    </template>
    <template #[`item.email`]="{ item }">
      {{ item.customer_user_info?.email }}
    </template>
    <template #[`item.rae_code`]="{ item }">
      {{ item.customer_user_info?.rae_code }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        prepend-icon="mdi-map-marker-multiple"
        text="Punti di ritiro"
        variant="text"
        @click="emit('open-collection-points', item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const emit = defineEmits(['open-collection-points']);

const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm, ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

const openForm = (item) => {
  user.value = item;
  activeForm.value = true;

  document.getElementById('customer-user-form')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};
</script>
