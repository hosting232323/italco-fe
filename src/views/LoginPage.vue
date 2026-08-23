<template>
  <section class="login-page">
    <AuthManager
      class="login-panel"
      title="Login"
      logo="/ares-app-icon.png"
      :secondary-color="theme.current.value.primaryColor"
      :sign-up="false"
      :hostname="hostname"
      :iv="iv"
      :secret-key="secretKey"
      @call-back="goToDashboard"
    />
  </section>
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
const { role, userId, token, company } = storeToRefs(userStore);

const goToDashboard = (data) => {
  role.value = data.role;
  userId.value = data.user_id;
  token.value = data.token;
  company.value = data.company;
  // Il super admin arriva senza company: prima sceglie, poi entra.
  if (data.role == 'Super Admin')
    router.push('companies');
  else
    router.push(['Admin', 'Operator'].includes(data.role) ? 'dashboard' : 'orders');
};
</script>

<style scoped>
.login-page {
  position: relative;
  display: flex;
  min-height: calc(100dvh - 164px);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(24px, 5vw, 64px) 20px;
  background:
    radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.92), transparent 30%),
    radial-gradient(circle at 88% 84%, rgba(53, 76, 124, 0.12), transparent 34%),
    linear-gradient(145deg, #f7f8ff 0%, #e7eafa 100%);
}

.login-page::before,
.login-page::after {
  position: absolute;
  width: 280px;
  height: 280px;
  border: 1px solid rgba(53, 76, 124, 0.12);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.login-page::before {
  top: -150px;
  right: -80px;
}

.login-page::after {
  bottom: -190px;
  left: -90px;
}

.login-panel {
  position: relative;
  z-index: 1;
}

.login-page :deep(.login-container) {
  width: 100%;
  max-width: 620px;
  padding: 0;
}

.login-page :deep(.login-container > .v-container) {
  min-height: auto !important;
  padding: 0;
}

.login-page :deep(.v-card) {
  overflow: hidden;
  border: 1px solid rgba(53, 76, 124, 0.12);
  border-radius: 28px !important;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 64px rgba(35, 48, 82, 0.2) !important;
  padding: clamp(28px, 5vw, 48px) !important;
  backdrop-filter: blur(14px);
}

.login-page :deep(.v-img) {
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(16, 54, 92, 0.2);
}

.login-page :deep(.v-card-title) {
  color: #1d2b49;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login-page :deep(.v-field) {
  overflow: hidden;
  border-radius: 14px;
  background: #f4f6fb;
  box-shadow: inset 0 0 0 1px rgba(53, 76, 124, 0.1);
  transition: background-color 180ms ease, box-shadow 180ms ease;
}

.login-page :deep(.v-field.v-field--focused) {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(53, 76, 124, 0.14);
}

.login-page :deep(.v-input__prepend) {
  margin-inline-end: 14px;
  color: #354c7c;
}

.login-page :deep(.v-btn) {
  min-height: 48px;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(53, 76, 124, 0.24);
  font-weight: 700;
  letter-spacing: 0.05em;
}

@media (max-width: 600px) {
  .login-page {
    min-height: calc(100dvh - 190px);
    padding: 24px 16px;
  }

  .login-page :deep(.v-card) {
    border-radius: 22px !important;
    padding: 24px 16px !important;
  }
}
</style>
