<template>
  <v-dialog max-width="1500" v-model="popUp">
    <template v-slot:activator>
      <v-container>
        <h1>
          Gestione GDO
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openCustomerGroupForm"
          />
        </h1><hr class="mt-2">
        <CustomerGroupForm />
        <CustomerGroupTable @openPopUp="openPopUp" />

      </v-container>
    </template>
    <template v-slot:default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
    </template>
  </v-dialog>
</template>

<script setup>
import CustomerGroupForm from '@/components/administration/users/CustomerGroupForm';
import CustomerGroupPopUp from '@/components/administration/users/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/users/CustomerGroupTable';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';

const popUp = ref(false);
const popUpType = ref('');
const customerGroupStore = useCustomerGroupStore();
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);

const openPopUp = (item, type) => {
  popUp.value = true;
  popUpType.value = type;
  if (type == 'customerGroup')
    customerGroup.value = item;
};

const openCustomerGroupForm = () => {
  customerGroup.value = {};
  customerGroupForm.value = true;
};
</script>
