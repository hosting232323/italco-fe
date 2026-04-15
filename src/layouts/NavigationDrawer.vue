<template>
  <v-navigation-drawer
    v-if="role != 'Delivery'"
    permanent
    expand-on-hover
    rail
    :color="theme.current.value.primaryColor"
    app
  >
    <v-list-item
      prepend-icon="mdi-menu"
      class="mt-2"
    >
      <b>Ares Logistics</b>
      <br>{{ role }}
    </v-list-item>
    <v-divider class="mb-4" />
    <v-list-item
      to="/dashboard"
      title="Dashboard"
      prepend-icon="mdi-view-dashboard"
    />
    <template v-if="['Admin', 'Operator'].includes(role)">
      <v-list-item
        to="/schedules"
        title="Borderò"
        prepend-icon="mdi-text-box-multiple-outline"
      />
      <template v-if="role == 'Admin'">
        <v-list-item
          to="/services"
          title="Servizi"
          prepend-icon="mdi-clipboard-list"
        />
        <v-list-item
          to="/delivery"
          title="Delivery"
          prepend-icon="mdi-truck-delivery"
        />
        <v-list-item
          to="/customer-points"
          title="Punti Vendita"
          prepend-icon="mdi-store-marker"
        />
        <v-list-item
          to="/users"
          title="Utenti"
          prepend-icon="mdi-account-group"
        />
        <v-list-item
          to="/log"
          title="Log"
          prepend-icon="mdi-math-log"
        />
      </template>
      <v-divider class="mb-4 mt-4" />
      <v-list-item
        to="/rae-dashboard"
        title="Ritiri Raee"
        prepend-icon="mdi-human-dolly"
      />
      <v-list-item
        v-if="role === 'Admin'"
        to="/rae-product-groups"
        prepend-icon="mdi-file-code"
      >
        <v-list-item-title>
          Configurazione<br>Raggruppamenti
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-list-item
      v-else
      to="/collection-points"
      title="Punti di Ritiro"
      prepend-icon="mdi-store"
    />
    <v-divider class="mb-4 mt-4" />
    <v-list-item
      title="Logout"
      prepend-icon="mdi-logout"
      @click="logoutModule.logout(router)"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import logoutModule from '@/utils/logout';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role } = storeToRefs(userStore);
</script>
