<template>
  <v-container>
    <h1>Pianificazione</h1><hr>
    <PlanningCoverage v-if="automaticPlanning" />
    <PlanningAutomaticTeaser v-else />
  </v-container>
</template>

<script setup>
import PlanningCoverage from '@/components/operator/planning/PlanningCoverage';
import PlanningAutomaticTeaser from '@/components/operator/planning/PlanningAutomaticTeaser';

import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { company } = storeToRefs(userStore);
const automaticPlanning = computed(() => !!company.value?.automatic_planning);
</script>
