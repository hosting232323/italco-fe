<template>
  <v-container>
    <h1>
      Logs
    </h1><hr>
    <LogTable />
    <LogFilters />
  </v-container>
</template>

<script setup>
import LogTable from '@/components/administration/users/LogTable';
import LogFilters from '@/components/administration/users/LogFilters';
</script>
