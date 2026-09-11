<template>
  <v-navigation-drawer
    permanent
    expand-on-hover
    rail
    :color="theme.current.value.primaryColor"
    app
  >
    <v-list-item
      prepend-icon="mdi-menu"
      class="mt-2 header-item"
    >
      <template #title>
        <span class="font-weight-bold text-truncate d-block">Ares Logistics</span>
      </template>
      <template #subtitle>
        <div class="text-truncate">
          {{ company ? company.name : 'Nessuna company' }}
        </div>
        <div class="text-truncate">
          {{ role }}
        </div>
      </template>
    </v-list-item>
    <v-divider class="my-2" />
    <template v-if="['Admin', 'Operator'].includes(effectiveRole)">
      <v-list-item
        to="/dashboard"
        title="Dashboard"
        prepend-icon="mdi-view-dashboard"
      />
    </template>
    <v-list-item
      v-if="effectiveRole != 'Super Admin'"
      to="/orders"
      title="Ordini"
      prepend-icon="mdi-package-variant-closed"
    />
    <template v-if="['Admin', 'Operator'].includes(effectiveRole)">
      <v-list-item
        to="/schedules"
        title="Borderò"
        prepend-icon="mdi-text-box-multiple-outline"
      />
      <v-list-item
        to="/delivery-coverage"
        title="Copertura corrieri"
        prepend-icon="mdi-calendar-account"
      />
      <template v-if="effectiveRole == 'Admin'">
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
      <template v-if="rae">
        <v-divider class="my-2" />
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
        <template v-if="effectiveRole == 'Admin'">
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
    </template>
    <v-list-item
      v-else-if="role == 'Customer'"
      to="/collection-points"
      title="Punti di Ritiro"
      prepend-icon="mdi-store"
    />
    <template v-if="role == 'Super Admin'">
      <v-divider
        v-if="company"
        class="my-2"
      />
      <v-list-item
        to="/companies"
        title="Company"
        prepend-icon="mdi-factory"
      />
    </template>
    <v-divider class="my-2" />
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
// role: identita' (intestazione, sezione Company). effectiveRole: permessi, con
// il super admin che opera in una company visto come admin (getter dello store).
const { role, company, effectiveRole } = storeToRefs(userStore);

// Modulo RAEE dell'attività su cui si sta operando: senza, il blocco di voci
// RAEE non esiste per nessun ruolo.
const rae = computed(() => !!company.value?.rae);
</script>
