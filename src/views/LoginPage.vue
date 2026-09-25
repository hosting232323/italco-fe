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
import session from '@/utils/session';

const hostname = import.meta.env.VITE_HOSTNAME;

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const { role, userId, token, company, automaticPlanning } = storeToRefs(userStore);

const goToDashboard = (data) => {
  // Il logout svuota gia' gli store, ma non e' l'unica strada per arrivare qui
  // (sessione caduta, scheda riaperta): chi entra non deve trovare in memoria
  // i dati di un'altra attivita'.
  session.clearTenantData();

  // Il gestionale web non ha più una dashboard Delivery: chi accede con
  // quel ruolo va mandato alla pagina di download dell'app.
  if (data.role === 'Delivery') {
    router.push({ name: 'Download App' });
    return;
  }

  role.value = data.role;
  userId.value = data.user_id;
  token.value = data.access_token;
  company.value = data.company;
  automaticPlanning.value = data.automatic_planning;
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
