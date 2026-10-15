<template>
  <v-dialog
    v-model="popUp"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>
          Gestione GDO
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openCustomerGroupForm"
          />
        </h1><hr>
        <CustomerGroupTable @open-pop-up="openPopUp" />
        <h1 id="customer-user-form">
          Dati Punti Vendita
        </h1><hr>
        <CustomerUserInfoTable @open-collection-points="openCollectionPoints" />
      </v-container>
    </template>
    <template #default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
    </template>
  </v-dialog>
  <v-dialog
    v-model="customerGroupForm"
    max-width="1500"
  >
    <CustomerGroupForm />
  </v-dialog>
  <v-dialog
    v-model="customerUserInfoForm"
    max-width="1500"
  >
    <CustomerUserInfoForm />
  </v-dialog>
  <v-dialog
    v-model="collectionPointsPopUp"
    max-width="1500"
  >
    <CustomerCollectionPointsPopUp
      v-if="collectionPointsCustomer"
      :customer="collectionPointsCustomer"
    />
  </v-dialog>
</template>

<script setup>
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm';
import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable';
import CustomerUserInfoForm from '@/components/administration/sellingPoints/CustomerUserInfoForm';
import CustomerUserInfoTable from '@/components/administration/sellingPoints/CustomerUserInfoTable';
import CustomerCollectionPointsPopUp from '@/components/administration/sellingPoints/CustomerCollectionPointsPopUp';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const popUp = ref(false);
const collectionPointsPopUp = ref(false);
const collectionPointsCustomer = ref(null);
const popUpType = ref('');
const customerGroupStore = useCustomerGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);
const { activeForm: customerUserInfoForm } = storeToRefs(administrationUserStore);

const openPopUp = (item, type) => {
  popUp.value = true;
  popUpType.value = type;
  if (type == 'customerGroup')
    customerGroup.value = item;
};

const openCollectionPoints = (customer) => {
  const collectionPointStore = useCollectionPointStore();
  collectionPointStore.customerId = customer.id;
  collectionPointStore.ready = false;
  collectionPointsCustomer.value = customer;
  collectionPointsPopUp.value = true;
};

const openCustomerGroupForm = () => {
  customerGroup.value = {};
  customerGroupForm.value = true;
};
</script>
