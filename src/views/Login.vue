<template>
  <AuthManager
    class="mt-10"
    title="Login"
    logo="/logo.png"
    :secondaryColor="theme.current.value.primaryColor"
    redirectLink="/dashboard"
    :signUp="false"
    :hostname="hostname"
    :iv="iv"
    :secretKey="secretKey"
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
