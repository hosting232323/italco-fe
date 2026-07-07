<template>
  <v-app>
    <NavigationDrawer />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
      <ChattyBot
        :hostname="http.hostname"
        :bot-data="botItalco"
        :http="http"
      />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import http from '@/utils/http';
import { ChattyBot } from 'generic-module';

import Footer from '@/layouts/FooterBar';
import NavigationDrawer from '@/layouts/NavigationDrawer';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { loadGoogleMapsScript } from '@/utils/googleMapsScript';

const theme = useTheme();

const botItalco = {
  name: 'Italco.mi Bot',
  image: '/logo.png',
  message: 'Ciao! Sono qui per rispondere alle tue domande sugli ordini.<br>Chiedimi quello che ti serve sapere specificando la data di creazione degli ordini interessati.',
  endpoint: 'chatty/message',
  sessionKey: 'thread_id',
  responseKey: 'message',
  color: {
    theme_color: '#354c7c',
    theme_color_hover: '#46639e',
    fab_hover: '#46639e',
    fab_shadow: '#9daccd',
    fab_border: '#26375a'
  }
};

onMounted(() => loadGoogleMapsScript());
</script>
