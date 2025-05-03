<template>
  <v-app-bar
    :color="theme.current.value.primaryColor"
    :elevation="2"
  >
    <v-app-bar-title><b>
      Ares Logistics
    </b></v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
