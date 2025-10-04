<template>
  <v-app v-if="isReady">
    <NavigationDrawer />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import NavigationDrawer from '@/layouts/NavigationDrawer';
import Footer from '@/layouts/FooterBar.vue';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { loadGoogleMapsScript } from '@/utils/googleMapsScript';

const theme = useTheme();
const userStore = useUserStore();
const { role, userId } = storeToRefs(userStore);
const isReady = ref(false);

onMounted(() => {
  role.value = localStorage.getItem('user_role');
  userId.value = localStorage.getItem('user_id');
  isReady.value = true;
  loadGoogleMapsScript();
});
</script>
