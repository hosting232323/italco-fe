<template>
  <v-container>
    <h1>Pianificazione</h1><hr>

    <v-tabs
      v-model="tab"
      class="mt-3"
      :color="theme.current.value.primaryColor"
    >
      <v-tab value="constraints">
        <v-icon start>
          mdi-tune-variant
        </v-icon>
        Vincoli
      </v-tab>
      <v-tab value="automatic">
        <v-icon start>
          {{ automaticPlanning ? 'mdi-map-marker-radius' : 'mdi-lock-outline' }}
        </v-icon>
        Pianificazione automatica
      </v-tab>
    </v-tabs>

    <v-tabs-window
      v-model="tab"
      class="mt-2"
    >
      <v-tabs-window-item value="constraints">
        <PlanningConstraints />
      </v-tabs-window-item>
      <v-tabs-window-item value="automatic">
        <PlanningCoverage v-if="automaticPlanning" />
        <PlanningAutomaticTeaser v-else />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script setup>
import PlanningCoverage from '@/components/operator/planning/PlanningCoverage';
import PlanningConstraints from '@/components/operator/planning/PlanningConstraints';
import PlanningAutomaticTeaser from '@/components/operator/planning/PlanningAutomaticTeaser';

import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const tab = ref('constraints');

const userStore = useUserStore();
const { company } = storeToRefs(userStore);
const automaticPlanning = computed(() => !!company.value?.automatic_planning);
</script>
