<template>
  <v-navigation-drawer expand-on-hover rail :color="theme.current.value.primaryColor" app>
    <v-list-item prepend-icon="mdi-menu" class="mt-6">
      <b>Gestionale Italco.mi</b>
    </v-list-item>
    <v-divider class="mb-4" />
    <v-list-item
      to="/dashboard"
      title="Dashboard"
      prepend-icon="mdi-view-dashboard"
    />
    <v-list-item
      v-if="role === 'Admin'"
      to="/services"
      title="Servizi"
      prepend-icon="mdi-clipboard-list"
    />
    <v-list-item
      v-if="role === 'Admin'"
      to="/users"
      title="Utenti"
      prepend-icon="mdi-account-group"
    />
    <v-list-item
      v-if="role === 'Customer'"
      to="/addressees"
      title="Anagrafiche"
      prepend-icon="mdi-account-multiple-outline"
    />
    <v-divider class="mb-4 mt-4" />
    <v-list-item
      to="/"
      title="Logout"
      prepend-icon="mdi-logout"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const userStore = useUserStore();
const { role } = storeToRefs(userStore);
</script>
