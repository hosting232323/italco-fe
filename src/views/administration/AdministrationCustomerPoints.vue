<template>
  <v-dialog
    v-model="popUp"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>
          Crea un utente Customer
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openCreateCustomerUserForm"
          />
        </h1><hr class="mt-2">
        <UserForm :role="'Customer'"/>
        <UserTable :role="'Customer'" />
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
        <CustomerGroupTable @open-pop-up="openPopUp" />
        <h1>
          Gestione Aree Geografiche
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openGeographicZoneForm"
          />
        </h1><hr class="mt-2">
        Attenzione: Se non vengono configurate regole per una certa area geografica,
        i punti vendita non potranno effettuare ordini per i clienti di quella zona.
        <GeographicZoneForm />
        <GeographicZoneTable @open-pop-up="openPopUp" />
        <h1>
          Gestione Regole Punti Vendita
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openCustomerRuleForm"
          />
        </h1><hr class="mt-2">
        <CustomerRuleForm />
        <CustomerRuleTable />
      </v-container>
    </template>
    <template #default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
      <ConstraintPopUp v-if="popUpType == 'constraint'" />
      <GeographicCodePopUp v-if="popUpType == 'geographicCode'" />
    </template>
  </v-dialog>
</template>

<script setup>
import UserForm from '@/components/administration/users/UserForm';
import UserTable from '@/components/administration/users/UserTable';
import ConstraintPopUp from '@/components/administration/sellingPoints/ConstraintPopUp';
import CustomerRuleForm from '@/components/administration/sellingPoints/CustomerRuleForm';
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm';
import CustomerRuleTable from '@/components/administration/sellingPoints/CustomerRuleTable';
import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable';
import GeographicZoneForm from '@/components/administration/sellingPoints/GeographicZoneForm';
import GeographicZoneTable from '@/components/administration/sellingPoints/GeographicZoneTable';
import GeographicCodePopUp from '@/components/administration/sellingPoints/GeographicCodePopUp';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const popUp = ref(false);
const popUpType = ref('');
const customerRuleStore = useCustomerRuleStore();
const customerGroupStore = useCustomerGroupStore();
const geographicZoneStore = useGeographicZoneStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: customerRuleForm, element: customerRule } = storeToRefs(customerRuleStore);
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);
const { activeForm: geographicZoneForm, element: geographicZone } = storeToRefs(geographicZoneStore);
const { activeForm: administrationUserForm, element: administrationUser } = storeToRefs(administrationUserStore);

const openPopUp = (item, type) => {
  popUp.value = true;
  popUpType.value = type;
  if (type == 'customerGroup')
    customerGroup.value = item;
  else if(['constraint', 'geographicCode'].includes(type))
    geographicZone.value = item;
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

const openCreateCustomerUserForm = () => {
  administrationUser.value = {};
  administrationUserForm.value = true;
};
</script>
