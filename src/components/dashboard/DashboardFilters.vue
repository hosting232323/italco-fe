<template>
  <v-card
    class="pa-4"
    rounded="lg"
    flat
    border
  >
    <v-form @submit.prevent="dashboardStore.load()">
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="filters.start"
            class="mr-md-2"
            label="Data di inizio"
            type="date"
            clearable
            hide-details
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="filters.end"
            class="mt-4 mt-md-0 ml-md-2"
            label="Data di fine"
            type="date"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <v-btn
        class="mt-4"
        block
        type="submit"
        text="Aggiorna"
        prepend-icon="mdi-refresh"
        :color="theme.current.value.primaryColor"
        :loading="loading"
      />
    </v-form>
  </v-card>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';

const theme = useTheme();

const dashboardStore = useDashboardStore();
const { filters, loading } = storeToRefs(dashboardStore);
</script>
