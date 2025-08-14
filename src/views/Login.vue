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
    :secretkey="secretkey"
  />
</template>

<script setup>
import { AuthManager } from 'generic-module';

import { useTheme } from 'vuetify';

const theme = useTheme();
const iv = import.meta.env.VITE_IV;
const secretkey = import.meta.env.VITE_SECRET_KEY;
const hostname = import.meta.env.VITE_HOSTNAME;
</script>
