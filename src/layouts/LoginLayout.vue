<template>
  <v-app>
    <AppBar v-if="!isNotFound" />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
    </v-main>
    <Footer v-if="!isNotFound" />
  </v-app>
</template>

<script setup>
import AppBar from '@/layouts/AppBar.vue';
import Footer from '@/layouts/Footer.vue';

import { useRoute } from 'vue-router';
import { useTheme } from 'vuetify';
import { computed } from 'vue';

const theme = useTheme();

const route = useRoute();
const isNotFound = computed(() => route.name === 'NotFound');
</script>
