<template>
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
  </v-container>
</template>

<script setup>
import UserForm from '@/components/administration/users/UserForm';
import UserTable from '@/components/administration/users/UserTable';

import { storeToRefs } from 'pinia';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const administrationUserStore = useAdministrationUserStore();
const { activeForm: userForm, element: user } = storeToRefs(administrationUserStore);

const openUserForm = () => {
  user.value = {};
  userForm.value = true;
};
</script>
