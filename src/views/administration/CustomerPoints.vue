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
        <GeographicZoneForm />
        <GeographicZoneTable @openPopUp="openPopUp" />

      </v-container>
    </template>
    <template v-slot:default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
      <GeographicZonePopUp v-if="popUpType == 'geographicZone'" />
    </template>
  </v-dialog>
</template>

<script setup>
import CustomerGroupForm from '@/components/administration/users/CustomerGroupForm';
import CustomerGroupPopUp from '@/components/administration/users/CustomerGroupPopUp';
import CustomerGroupTable from '@/components/administration/users/CustomerGroupTable';
import GeographicZoneForm from '@/components/administration/users/GeographicZoneForm';
import GeographicZonePopUp from '@/components/administration/users/GeographicZonePopUp';
import GeographicZoneTable from '@/components/administration/users/GeographicZoneTable';

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
  else if(type == 'geographicZone')
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
