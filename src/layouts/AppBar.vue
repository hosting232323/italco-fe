<template>
  <v-app-bar
    :color="theme.current.value.primaryColor"
    :elevation="2"
  >
    <v-img
      src="/hubstra-wordmark.png"
      alt="Logo Hubstra"
      class="ml-4"
      height="32"
      max-width="185"
      position="left center"
    />
  </v-app-bar>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
