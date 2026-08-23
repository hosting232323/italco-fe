<template>
  <v-app-bar
    :color="theme.current.value.primaryColor"
    :elevation="2"
  >
    <v-img
      src="/ares-app-icon.png"
      alt="Logo Ares Logistics"
      class="ml-4 mr-2 rounded-lg"
      height="36"
      max-width="36"
      width="36"
      cover
    />
    <v-app-bar-title>
      <b>
        Ares Logistics
      </b>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
