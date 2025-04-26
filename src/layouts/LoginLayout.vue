<template>
  <v-app>
    <AppBar />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppBar from './AppBar.vue';

import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
