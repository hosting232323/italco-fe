<template>
  <v-container class="table-page">
    <PageHeader title="Gestione Utenti">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo utente"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openUserForm"
      />
    </PageHeader>
    <UserTable />
  </v-container>
  <v-dialog
    v-model="userForm"
    max-width="1500"
  >
    <UserForm />
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import UserForm from '@/components/administration/users/UserForm';
import UserTable from '@/components/administration/users/UserTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: userForm, element: user } = storeToRefs(administrationUserStore);

const openUserForm = () => {
  user.value = { automatic_planning: true };
  userForm.value = true;
};
</script>
