<template>
  <v-app>
    <AppBar />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import AppBar from '@/layouts/AppBar.vue';
import Footer from '@/layouts/Footer.vue';

import { useTheme } from 'vuetify';

const theme = useTheme();
</script>
