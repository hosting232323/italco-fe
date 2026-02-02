<template>
  <v-dialog v-model="popUp" max-width="1500">
    <template #activator>
      <v-container>
        <h1>
          Logs
        </h1>
        <hr>
        <LogFilters />
        <LogTable 
          @open-pop-up="popUp = true" 
        />
      </v-container>
    </template>

    <template #default>
      <LogPopUp v-if="popUp" />
    </template>
  </v-dialog>
</template>

<script setup>
import LogTable from '@/components/administration/logs/LogTable';
import LogPopUp from '@/components/administration/logs/LogPopUp';
import LogFilters from '@/components/administration/logs/LogFilters';

import { ref } from 'vue';

const popUp = ref(false);
</script>
