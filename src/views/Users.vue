<template>
  <v-dialog max-width="1500">
    <template v-slot:activator="{ props: activatorProps }">
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
        <DeliveryGroupTable :activatorProps="activatorProps" />
      </v-container>
    </template>
    <template v-slot:default="{ isActive }">
      <UserPopUp :isActive="isActive" />
    </template>
  </v-dialog>
</template>

<script setup>
import UserForm from '@/components/administration/users/Form';
import UserTable from '@/components/administration/users/Table';
import UserPopUp from '@/components/administration/users/PopUp';
import DeliveryGroupForm from '@/components/administration/users/DeliveryGroupForm';
import DeliveryGroupTable from '@/components/administration/users/DeliveryGroupTable';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const router = useRouter();
const deliveryGroupStore = useDeliveryGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: userForm, element: user } = storeToRefs(administrationUserStore);
const { activeForm: deliveryGroupForm, element: deliveryGroup } = storeToRefs(deliveryGroupStore);
deliveryGroupStore.initList(router);
administrationUserStore.initList(router);

const openUserForm = () => {
  user.value = {};
  userForm.value = true;
};

const openDeliveryGroupForm = () => {
  deliveryGroup.value = {};
  deliveryGroupForm.value = true;
};
</script>
