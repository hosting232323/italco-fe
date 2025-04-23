<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list-item title="Gestionale Italco.mi" prepend-icon="mdi-menu" class="mt-6" />
    <v-divider class="mb-4" />
    <v-list-item to="/dashboard" title="Dashboard" prepend-icon="mdi-view-dashboard" />
    <v-list-item to="/services" title="Servizi" prepend-icon="mdi-clipboard-list" />
    <v-list-item to="/users" title="Utenti" prepend-icon="mdi-account-group" />
  </v-navigation-drawer>
</template>

<script setup>
//
</script>
