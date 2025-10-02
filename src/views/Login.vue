<template>
  <AuthManager
    class="mt-10"
    title="Login"
    logo="/logo.png"
    :primary-color="theme.current.value.primaryColor"
    :secondary-color="theme.current.value.primaryColor"
    redirect-link="/dashboard"
    :sign-up="false"
    :hostname="hostname"
    :iv="iv"
    :secret-key="secretKey"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { AuthManager } from 'generic-module';

const theme = useTheme();
const iv = import.meta.env.VITE_IV;
const hostname = import.meta.env.VITE_HOSTNAME;
const secretKey = import.meta.env.VITE_SECRET_KEY;
</script>
