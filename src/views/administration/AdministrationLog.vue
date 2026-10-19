<template>
  <v-dialog
    v-model="activePopUp"
    max-width="1500"
  >
    <template #activator>
      <v-container class="table-page">
        <PageHeader title="Logs" />
        <LogFilters />
        <LogTable />
      </v-container>
    </template>

    <template #default>
      <LogPopUp v-if="activePopUp" />
    </template>
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import LogTable from '@/components/administration/logs/LogTable';
import LogPopUp from '@/components/administration/logs/LogPopUp';
import LogFilters from '@/components/administration/logs/LogFilters';

import { storeToRefs } from 'pinia';
import { useLogStore } from '@/stores/log';

const logStore = useLogStore();
const { activePopUp } = storeToRefs(logStore);
</script>
