<template>
  <v-navigation-drawer permanent expand-on-hover rail :color="theme.current.value.primaryColor" app>
    <v-list-item prepend-icon="mdi-menu" class="mt-2">
      <b>Ares Logistics</b>
      <br>{{ role }}
    </v-list-item>
    <v-divider class="mb-4" />
    <v-list-item
      id="menu-dashboard"
      to="/dashboard"
      title="Dashboard"
      prepend-icon="mdi-view-dashboard"
    />
    <v-list-item
      v-if="['Admin', 'Operator'].includes(role)"
      id="menu-bordero"
      to="/schedules"
      title="Borderò"
      prepend-icon="mdi-text-box-multiple-outline"
    />
    <v-list-item
      v-if="role === 'Admin'"
      id="menu-servizi"
      to="/services"
      title="Servizi"
      prepend-icon="mdi-clipboard-list"
    />
    <v-list-item
      v-if="role === 'Admin'"
      id="menu-veicoli"
      to="/transports"
      title="Veicoli"
      prepend-icon="mdi-truck-delivery"
    />
    <v-list-item
      v-if="role === 'Admin'"
      id="menu-utenti"
      to="/users"
      title="Utenti"
      prepend-icon="mdi-account-group"
    />
    <v-list-item
      v-if="role === 'Admin'"
      to="/customer-points"
      title="Punti Vendita"
      prepend-icon="mdi-store-marker"
    />
    <v-list-item
      v-if="role === 'Customer'"
      id="menu-punti-ritiro"
      to="/collection-points"
      title="Punti di Ritiro"
      prepend-icon="mdi-store"
    />
    <v-divider class="mb-4 mt-4" />
    <v-list-item
      @click="handleLogout"
      title="Logout"
      id="menu-logout"
      prepend-icon="mdi-logout"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role } = storeToRefs(userStore);

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>
