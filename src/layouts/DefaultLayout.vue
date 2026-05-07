<template>
  <v-app>
    <NavigationDrawer />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
      <ChattyBot 
        :hostname="viteHostname"
        :bot-data="botLanding"
      />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import Footer from '@/layouts/FooterBar';
import { ChattyBot } from 'generic-module';
import NavigationDrawer from '@/layouts/NavigationDrawer';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { loadGoogleMapsScript } from '@/utils/googleMapsScript';

const theme = useTheme();
const viteHostname = import.meta.env.VITE_HOSTNAME;

onMounted(() => loadGoogleMapsScript());

const botLanding = {
  id: 3,
  message: 'Ciao! Sono qui per rispondere alle tue domande sugli ordini.<br>Chiedimi quello che ti serve sapere specificando la data di creazione degli ordini interessati.',
  name: 'Italco.mi Bot',
  image: '/logo.png',
  color: {
    theme_color: 'rgb(53, 76, 124)',
    theme_color_hover: 'rgb(71, 96, 156)',
    fab_hover: 'rgb(71, 96, 156)',
    fab_shadow: 'rgba(38, 55, 90, 0.5)',
    fab_border: 'rgb(38, 55, 90)'
  },
};
</script>
