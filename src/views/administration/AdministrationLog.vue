<template>
  <v-container>
    <h1>
      Logs
    </h1><hr>
    <LogFilters />
    <LogTable />
  </v-container>
</template>

<script setup>
import LogTable from '@/components/administration/logs/LogTable';
import LogFilters from '@/components/administration/logs/LogFilters';
</script>
