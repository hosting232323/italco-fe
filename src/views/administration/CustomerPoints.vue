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
        <GeographicZoneTable @openPopUp="openPopUp" />

      </v-container>
    </template>
    <template v-slot:default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
      <ConstraintPopUp v-if="popUpType == 'constraint'" />
      <GeographicCodePopUp v-if="popUpType == 'geographicCode'" />
    </template>
  </v-dialog>
</template>

<script setup>
import ConstraintPopUp from '@/components/administration/sellingPoints/ConstraintPopUp';
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm';
import CustomerGroupPopUp from '@/components/administration/sellingPoints/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable';
import GeographicZoneForm from '@/components/administration/sellingPoints/GeographicZoneForm';
import GeographicZoneTable from '@/components/administration/sellingPoints/GeographicZoneTable';
import GeographicCodePopUp from '@/components/administration/sellingPoints/GeographicCodePopUp';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const popUp = ref(false);
const popUpType = ref('');
const customerGroupStore = useCustomerGroupStore();
const geographicZoneStore = useGeographicZoneStore();
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);
const { activeForm: geographicZoneForm, element: geographicZone } = storeToRefs(geographicZoneStore);

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

const openGeographicZoneForm = () => {
  geographicZone.value = {};
  geographicZoneForm.value = true;
};
</script>
