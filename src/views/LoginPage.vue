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
  <v-alert
    v-if="deliveryBlocked"
    class="mt-4 mx-auto"
    type="info"
    variant="tonal"
    style="max-width: 500px;"
  >
    Gli utenti Delivery non accedono più dal gestionale: usa l'app Ares Delivery.
  </v-alert>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthManager } from 'generic-module';
import { useUserStore } from '@/stores/user';

const hostname = import.meta.env.VITE_HOSTNAME;

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const deliveryBlocked = ref(false);
const { role, userId, token, company } = storeToRefs(userStore);

const goToDashboard = (data) => {
  if (data.role === 'Delivery') {
    userStore.$reset();
    deliveryBlocked.value = true;
    return;
  }

  deliveryBlocked.value = false;
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
