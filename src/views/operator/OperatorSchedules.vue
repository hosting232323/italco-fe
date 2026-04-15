<template>
  <v-container>
    <h1>Borderò</h1><hr>
    <ScheduleFilters />
    <ScheduleTable @open-dialog="dialog = true" />
  </v-container>
  <v-dialog
    v-model="dialog"
    max-width="1200"
  >
    <ScheduleForm @cancel="dialog = false" />
  </v-dialog>
</template>

<script setup>
import ScheduleForm from '@/components/operator/schedules/ScheduleForm';
import ScheduleTable from '@/components/operator/schedules/ScheduleTable';
import ScheduleFilters from '@/components/operator/schedules/ScheduleFilters';

import { ref } from 'vue';

const dialog = ref(false);
</script>
