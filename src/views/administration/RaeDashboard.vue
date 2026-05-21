<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-container>
        <h1>Ritiri Raee</h1><hr>
        <RaeProductFilters />
        <RaeProductTable :activator-props="activatorProps" />
      </v-container>
    </template>
    <template #default>
      <RaeProductPopUp />
    </template>
  </v-dialog>
</template>

<script setup>
import RaeProductTable from '@/components/administration/raeProducts/RaeProductTable';
import RaeProductPopUp from '@/components/administration/raeProducts/RaeProductPopUp';
import RaeProductFilters from '@/components/administration/raeProducts/RaeProductFilters';
</script>
