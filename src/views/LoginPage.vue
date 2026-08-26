<template>
  <AuthManager
    class="mt-10 rounded-login-logo"
    title="Login"
    logo="/ares-app-icon.png"
    :secondary-color="theme.current.value.primaryColor"
    :sign-up="false"
    :hostname="hostname"
    @call-back="goToDashboard"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthManager } from 'generic-module';
import { useUserStore } from '@/stores/user';

const hostname = import.meta.env.VITE_HOSTNAME;

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role, userId, token, company } = storeToRefs(userStore);

const goToDashboard = (data) => {
  role.value = data.role;
  userId.value = data.user_id;
  token.value = data.access_token;
  company.value = data.company;
  // Il super admin arriva senza company: prima sceglie, poi entra.
  if (data.role == 'Super Admin')
    router.push('companies');
  else
    router.push(['Admin', 'Operator'].includes(data.role) ? 'dashboard' : 'orders');
};
</script>

<style scoped>
.rounded-login-logo :deep(.v-img) {
  overflow: hidden;
  border-radius: 20px;
}
</style>
