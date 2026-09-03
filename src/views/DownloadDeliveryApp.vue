<template>
  <v-container
    class="d-flex flex-column align-center text-center"
    style="max-width: 500px;"
  >
    <v-img
      src="/ares-app-icon.png"
      max-width="96"
      class="mb-6 rounded-login-logo"
    />
    <h1>App Ares Delivery</h1>
    <p class="mt-2 mb-8">
      Gli utenti Delivery non accedono più dal gestionale: il giro consegne si gestisce
      dall'app mobile Ares Delivery. Scaricala dallo store del tuo telefono.
    </p>
    <v-btn
      href="https://play.google.com/apps/testing/it.areslogistics.delivery"
      target="_blank"
      rel="noopener"
      color="primary"
      size="large"
      prepend-icon="mdi-android"
      block
      class="mb-4"
    >
      Scarica per Android
    </v-btn>
    <v-btn
      href="https://testflight.apple.com/join/BYwgstTW"
      target="_blank"
      rel="noopener"
      color="primary"
      size="large"
      prepend-icon="mdi-apple"
      block
      variant="outlined"
    >
      Scarica per iOS
    </v-btn>
  </v-container>
</template>

<script setup>
//
</script>

<style scoped>
.rounded-login-logo {
  overflow: hidden;
  border-radius: 20px;
}
</style>
