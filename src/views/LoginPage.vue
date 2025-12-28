<template>
  <AuthManager
    class="mt-10"
    title="Login"
    logo="/logo.png"
    :secondary-color="theme.current.value.primaryColor"
    :sign-up="false"
    :hostname="hostname"
    :iv="iv"
    :secret-key="secretKey"
    @call-back="goToDashboard"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthManager } from 'generic-module';
import { useUserStore } from '@/stores/user';

const iv = import.meta.env.VITE_IV;
const hostname = import.meta.env.VITE_HOSTNAME;
const secretKey = import.meta.env.VITE_SECRET_KEY;

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role, userId, token } = storeToRefs(userStore);

const goToDashboard = (data) => {
  role.value = data.role;
  userId.value = data.user_id;
  token.value = data.token;
  router.push('dashboard');
};
</script>
