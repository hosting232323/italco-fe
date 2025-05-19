<template>
  <v-dialog max-width="1500" v-model="popUp">
    <template v-slot:activator>
      <v-container>
        <h1>
          Gestione Utenti
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openUserForm"
          />
        </h1><hr>
        <UserForm />
        <UserTable />
        <v-row no-gutters>
          <v-col cols="12" md="6" :class="isMobile ? '' : 'pr-2'">
            <h2>
              Gruppi Delivery
              <v-btn
                icon="mdi-plus"
                style="float: right;"
                variant="text"
                @click="openDeliveryGroupForm"
              />
            </h2><hr class="mt-2">
            <DeliveryGroupForm />
            <DeliveryGroupTable @openPopUp="openPopUp" />
          </v-col>
          <v-col cols="12" md="6" :class="isMobile ? '' : 'pl-2'">
            <h2>
              Gestione GDO
              <v-btn
                icon="mdi-plus"
                style="float: right;"
                variant="text"
                @click="openCustomerGroupForm"
              />
            </h2><hr class="mt-2">
            <CustomerGroupForm />
            <CustomerGroupTable @openPopUp="openPopUp" />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:default>
      <CustomerGroupPopUp v-if="popUpType == 'customerGroup'" />
      <DeliveryGroupPopUp v-if="popUpType == 'deliveryGroup'" />
    </template>
  </v-dialog>
</template>

<script setup>
import UserForm from '@/components/administration/users/Form';
import UserTable from '@/components/administration/users/Table';
import CustomerGroupForm from '@/components/administration/users/CustomerGroupForm';
import DeliveryGroupForm from '@/components/administration/users/DeliveryGroupForm';
import CustomerGroupPopUp from '@/components/administration/users/CustomerGroupPopUp';
import DeliveryGroupPopUp from '@/components/administration/users/DeliveryGroupPopUp';
import CustomerGroupTable from '@/components/administration/users/CustomerGroupTable';
import DeliveryGroupTable from '@/components/administration/users/DeliveryGroupTable';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const popUp = ref(false);
const popUpType = ref('');
const isMobile = mobile.setupMobileUtils();
const customerGroupStore = useCustomerGroupStore();
const deliveryGroupStore = useDeliveryGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: userForm, element: user } = storeToRefs(administrationUserStore);
const { activeForm: customerGroupForm, element: customerGroup } = storeToRefs(customerGroupStore);
const { activeForm: deliveryGroupForm, element: deliveryGroup } = storeToRefs(deliveryGroupStore);

const openPopUp = (item, type) => {
  popUp.value = true;
  popUpType.value = type;
  if (type == 'customerGroup')
    customerGroup.value = item;
  else if (type == 'deliveryGroup')
    deliveryGroup.value = item;
};

const openUserForm = () => {
  user.value = {};
  userForm.value = true;
};

const openDeliveryGroupForm = () => {
  deliveryGroup.value = {};
  deliveryGroupForm.value = true;
};

const openCustomerGroupForm = () => {
  customerGroup.value = {};
  customerGroupForm.value = true;
};
</script>
