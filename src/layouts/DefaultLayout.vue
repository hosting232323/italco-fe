<template>
  <v-app>
    <NavigationDrawer />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
      <ChattyBot />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import Footer from '@/layouts/FooterBar';
import ChattyBot from '@/layouts/ChattyBot';
import NavigationDrawer from '@/layouts/NavigationDrawer';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { loadGoogleMapsScript } from '@/utils/googleMapsScript';

const theme = useTheme();

onMounted(() => loadGoogleMapsScript());
</script>
