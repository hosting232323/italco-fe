<template>
  <v-app v-if="isReady">
    <AdministrationDrawer v-if="role === 'Admin'" />
    <AppBar v-else />
    <v-main :style="{ backgroundColor: theme.current.value.secondaryColor }">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppBar from '@/layouts/AppBar';
import AdministrationDrawer from '@/layouts/AdministrationDrawer';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const theme = useTheme();
const userStore = useUserStore();
const { role, userId } = storeToRefs(userStore);
const isReady = ref(false);

onMounted(() => {
  role.value = localStorage.getItem('user_role');
  userId.value = localStorage.getItem('user_id');
  isReady.value = true;
});
</script>
