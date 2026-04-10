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
      <br>{{ company.name }}
      <br>{{ role }}
    </v-list-item>
    <v-divider class="mb-4" />
    <template v-if="['Admin', 'Operator'].includes(role)">
      <v-list-item
        to="/dashboard"
        title="Dashboard"
        prepend-icon="mdi-view-dashboard"
      />
    </template>
    <v-list-item
      to="/orders"
      title="Ordini"
      prepend-icon="mdi-package-variant-closed"
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
        to="/rae-disposal"
        title="Smaltimenti"
        prepend-icon="mdi-delete-empty"
      />
      <template v-if="role == 'Admin'">
        <v-list-item
          to="/rae-product-groups"
          title="Raggruppamenti"
          prepend-icon="mdi-file-code"
        />
        <v-list-item
          to="/rae-carrier"
          title="Trasportatori"
          prepend-icon="mdi-car-pickup"
        />
        <v-list-item
          to="/rae-collection-center"
          title="Centri di Raccolta"
          prepend-icon="mdi-map-marker-radius"
        />
      </template>
    </template>
    <v-list-item
      v-else
      to="/collection-points"
      title="Punti di Ritiro"
      prepend-icon="mdi-store"
    />
    <v-list-item
      v-if="role === 'Super Admin'"
      to="/collection-points"
      title="Seleziona la company"
      prepend-icon="mdi-factory"
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
import { useCompanyStore } from '@/stores/company';

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const { role, company } = storeToRefs(userStore);

const { list, element } = storeToRefs(companyStore);


companyStore.initList(router);
</script>
