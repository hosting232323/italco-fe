<template>
  <v-container>
    <h1>
      Gestione Utenti
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <UserForm />
    <UserTable />
  </v-container>
</template>

<script setup>
import UserForm from '@/components/administration/users/Form';
import UserTable from '@/components/administration/users/Table';

import { storeToRefs } from 'pinia';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const administrationUserStore = useAdministrationUserStore();
const { activeForm, element: user } = storeToRefs(administrationUserStore);
administrationUserStore.initList();

const openForm = () => {
  user.value = {};
  activeForm.value = true;
};
</script>
