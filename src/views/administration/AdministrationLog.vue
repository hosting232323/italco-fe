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
import LogFilters from '@/components/administration/users/LogFilters';
import LogTable from '@/components/administration/users/LogTable';
</script>
