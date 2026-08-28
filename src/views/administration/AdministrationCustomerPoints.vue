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
        <h1>
          Gestione Aree Geografiche
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openGeographicZoneForm"
          />
        </h1><hr>
        Attenzione: Se non vengono configurate regole per una certa area geografica,
        i punti vendita non potranno effettuare ordini per i clienti di quella zona.
        <GeographicZoneTable @open-pop-up="openPopUp" />
        <h1>
          Gestione Regole Punti Vendita
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openCustomerRuleForm"
          />
        </h1><hr>
        <CustomerRuleTable />
        <h1 id="customer-user-form">
          Dati Punti Vendita
        </h1><hr>
        <CustomerUserInfoTable />
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
</template>

<script setup>
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
const { activeForm: customerUserInfoForm } = storeToRefs(administrationUserStore);

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
</script>
