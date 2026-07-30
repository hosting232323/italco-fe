<template>
  <v-form @submit.prevent="dashboardStore.load()">
    <v-row
      no-gutters
      class="mb-5"
    >
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="filters.start"
          :class="isMobile ? '' : 'mr-2'"
          label="Data di inizio"
          type="date"
          clearable
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="filters.end"
          :class="isMobile ? '' : 'ml-2 mr-2'"
          label="Data di fine"
          type="date"
          clearable
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="d-flex align-center"
      >
        <v-btn
          block
          type="submit"
          text="Aggiorna"
          prepend-icon="mdi-refresh"
          :color="theme.current.value.primaryColor"
          :loading="loading"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useDashboardStore } from '@/stores/dashboard';

const theme = useTheme();
const isMobile = mobile.setupMobileUtils();

const dashboardStore = useDashboardStore();
const { filters, loading } = storeToRefs(dashboardStore);
</script>
