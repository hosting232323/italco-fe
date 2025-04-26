<template>
  <AuthManager
    title="Login"
    :secondaryColor="theme.current.value.primaryColor"
    redirectLink="/dashboard"
    :hostname="hostname"
    :signUp="false"
  />
</template>

<script setup>
import { AuthManager } from 'generic-module';
import { useTheme } from 'vuetify';

const theme = useTheme();

const hostname = import.meta.env.VITE_HOSTNAME;
</script>
