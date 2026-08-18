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
      <br>{{ company ? company.name : 'Nessuna company' }}
      <br>{{ role }}
    </v-list-item>
    <v-divider class="mb-4" />
    <template v-if="['Admin', 'Operator'].includes(menuRole)">
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
    <template v-if="['Admin', 'Operator'].includes(menuRole)">
      <v-list-item
        to="/schedules"
        title="Borderò"
        prepend-icon="mdi-text-box-multiple-outline"
      />
      <template v-if="menuRole == 'Admin'">
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
      <template v-if="menuRole == 'Admin'">
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
      v-else-if="role == 'Customer'"
      to="/collection-points"
      title="Punti di Ritiro"
      prepend-icon="mdi-store"
    />
    <template v-if="role == 'Super Admin'">
      <v-divider class="mb-4 mt-4" />
      <v-list-item
        to="/companies"
        title="Company"
        prepend-icon="mdi-factory"
      />
    </template>
    <v-divider class="mb-4 mt-4" />
    <v-list-item
      title="Logout"
      prepend-icon="mdi-logout"
      @click="logoutModule.logout(router)"
    />
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import logoutModule from '@/utils/logout';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role, company } = storeToRefs(userStore);

// Un super admin che ha scelto una company opera dentro quella company con i
// permessi di un admin: il menu deve rispecchiarlo senza duplicare ogni voce.
const menuRole = computed(() => (role.value == 'Super Admin' && company.value ? 'Admin' : role.value));
</script>
