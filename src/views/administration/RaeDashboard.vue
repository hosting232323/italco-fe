<template>
  <v-container>
    <h1>Ritiri Raee</h1><hr>
    <RaeProductFilters />
    <RaeProductTable />
  </v-container>
</template>

<script setup>
import RaeProductTable from '@/components/administration/raeProducts/RaeProductTable';
import RaeProductFilters from '@/components/administration/raeProducts/RaeProductFilters';
</script>
