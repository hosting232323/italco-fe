<template>
  <v-dialog
    v-model="popUp"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <PageHeader title="Gestione GDO">
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuovo GDO"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openCustomerGroupForm"
          />
        </PageHeader>
        <CustomerGroupTable @open-pop-up="openPopUp" />
        <PageHeader
          id="customer-user-form"
          title="Dati Punti Vendita"
        />
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
import PageHeader from '@/components/PageHeader';
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm';
import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable';
import CustomerUserInfoForm from '@/components/administration/sellingPoints/CustomerUserInfoForm';
import CustomerUserInfoTable from '@/components/administration/sellingPoints/CustomerUserInfoTable';
import CustomerCollectionPointsPopUp from '@/components/administration/sellingPoints/CustomerCollectionPointsPopUp';

import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const theme = useTheme();
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
