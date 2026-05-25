<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>Ritiri Raee</h1><hr>
        <RaeProductFilters />
        <RaeProductTable @open-dialog="dialog = true" />
      </v-container>
    </template>
    <template #default>
      <RaeProductPopUp @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import RaeProductTable from '@/components/operator/raeProducts/RaeProductTable';
import RaeProductPopUp from '@/components/operator/raeProducts/RaeProductPopUp';
import RaeProductFilters from '@/components/operator/raeProducts/RaeProductFilters';

import { ref } from 'vue';

const dialog = ref(false);
</script>
