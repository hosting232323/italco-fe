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
        <PageHeader title="Gestione Aree Geografiche">
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuova area geografica"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openGeographicZoneForm"
          />
        </PageHeader>
        Attenzione: Se non vengono configurate regole per una certa area geografica,
        i punti vendita non potranno effettuare ordini per i clienti di quella zona.
        <GeographicZoneTable @open-pop-up="openPopUp" />
        <PageHeader title="Gestione Regole Punti Vendita">
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuova regola"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openCustomerRuleForm"
          />
        </PageHeader>
        <CustomerRuleTable />
        <PageHeader
          id="customer-user-form"
          title="Dati Punti Vendita"
        />
        <CustomerUserInfoTable @open-collection-points="openCollectionPoints" />
      </v-container>
    </template>
    <template #default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
      <ConstraintPopUp v-if="popUpType == 'constraint'" />
      <GeographicCodePopUp v-if="popUpType == 'geographicCode'" />
    </template>
  </v-dialog>
  <v-dialog
    v-model="customerGroupForm"
    max-width="1500"
  >
    <CustomerGroupForm />
  </v-dialog>
  <v-dialog
    v-model="geographicZoneForm"
    max-width="1500"
  >
    <GeographicZoneForm />
  </v-dialog>
  <v-dialog
    v-model="customerRuleForm"
    max-width="1500"
  >
    <CustomerRuleForm />
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
import ConstraintPopUp from '@/components/administration/sellingPoints/ConstraintPopUp';
import CustomerRuleForm from '@/components/administration/sellingPoints/CustomerRuleForm';
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm';
import CustomerRuleTable from '@/components/administration/sellingPoints/CustomerRuleTable';
import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable';
import GeographicZoneForm from '@/components/administration/sellingPoints/GeographicZoneForm';
import GeographicZoneTable from '@/components/administration/sellingPoints/GeographicZoneTable';
import GeographicCodePopUp from '@/components/administration/sellingPoints/GeographicCodePopUp';
import CustomerUserInfoForm from '@/components/administration/sellingPoints/CustomerUserInfoForm';
import CustomerUserInfoTable from '@/components/administration/sellingPoints/CustomerUserInfoTable';
import CustomerCollectionPointsPopUp from '@/components/administration/sellingPoints/CustomerCollectionPointsPopUp';

import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const theme = useTheme();
const popUp = ref(false);
const collectionPointsPopUp = ref(false);
const collectionPointsCustomer = ref(null);
const popUpType = ref('');
const customerRuleStore = useCustomerRuleStore();
const customerGroupStore = useCustomerGroupStore();
const geographicZoneStore = useGeographicZoneStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: customerRuleForm, element: customerRule } = storeToRefs(customerRuleStore);
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);
const { activeForm: geographicZoneForm, element: geographicZone } = storeToRefs(geographicZoneStore);
const { activeForm: customerUserInfoForm } = storeToRefs(administrationUserStore);

const openPopUp = (item, type) => {
  popUp.value = true;
  popUpType.value = type;
  if (type == 'customerGroup')
    customerGroup.value = item;
  else if(['constraint', 'geographicCode'].includes(type))
    geographicZone.value = item;
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

const openCustomerRuleForm = () => {
  customerRule.value = {};
  customerRuleForm.value = true;
};

const openGeographicZoneForm = () => {
  geographicZone.value = {};
  geographicZoneForm.value = true;
};
</script>
