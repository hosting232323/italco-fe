<template>
  <v-dialog
    v-model="popUp"
    max-width="1500"
  >
    <template #activator>
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
        <h1>
          Gruppi Delivery
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openDeliveryGroupForm"
          />
        </h1><hr class="mt-2">
        <DeliveryGroupForm />
        <DeliveryGroupTable @open-pop-up="openPopUp" />
      </v-container>
    </template>
    <template #default>
      <DeliveryGroupPopUp />
    </template>
  </v-dialog>
</template>

<script setup>
import UserForm from '@/components/administration/users/UserForm';
import UserTable from '@/components/administration/users/UserTable';
import DeliveryGroupForm from '@/components/administration/users/DeliveryGroupForm';
import DeliveryGroupPopUp from '@/components/administration/users/DeliveryGroupPopUp';
import DeliveryGroupTable from '@/components/administration/users/DeliveryGroupTable';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const popUp = ref(false);
const deliveryGroupStore = useDeliveryGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: userForm, element: user } = storeToRefs(administrationUserStore);
const { activeForm: deliveryGroupForm, element: deliveryGroup } = storeToRefs(deliveryGroupStore);

const openPopUp = (item) => {
  popUp.value = true;
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
</script>
