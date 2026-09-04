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
      dall'app mobile Ares Delivery. L'accesso va attivato dal tuo responsabile prima di
      poter installare l'app.
    </p>

    <v-card
      variant="outlined"
      class="mb-6 pa-4 text-left"
      width="100%"
    >
      <div class="d-flex align-center mb-3">
        <v-icon
          icon="mdi-android"
          class="mr-2"
        />
        <strong>Android</strong>
      </div>
      <ol class="pl-4 mb-4">
        <li>Il tuo responsabile ti aggiunge al gruppo tester Google</li>
        <li>Da quel gruppo apri il link di installazione e segui le istruzioni del Play Store</li>
      </ol>
      <v-btn
        href="https://groups.google.com/g/corrieri-ares"
        target="_blank"
        rel="noopener"
        color="primary"
        block
        class="mb-2"
      >
        1. Gruppo tester Android
      </v-btn>
      <v-btn
        href="https://play.google.com/apps/testing/it.areslogistics.delivery"
        target="_blank"
        rel="noopener"
        color="primary"
        variant="outlined"
        block
      >
        2. Installa l'app
      </v-btn>
    </v-card>

    <v-card
      variant="outlined"
      class="pa-4 text-left"
      width="100%"
    >
      <div class="d-flex align-center mb-3">
        <v-icon
          icon="mdi-apple"
          class="mr-2"
        />
        <strong>iOS</strong>
      </div>
      <ol class="pl-4 mb-4">
        <li>Il tuo responsabile ti invita come tester: ricevi una mail da Apple</li>
        <li>Apri quella mail e accetta l'invito a TestFlight</li>
        <li>Da TestFlight installi l'app Ares Delivery</li>
      </ol>
      <p class="text-body-2 mb-3">
        Non hai ancora ricevuto l'invito? Contatta il tuo responsabile: l'accesso all'app
        va abilitato da lui uno per uno, non c'è un link pubblico.
      </p>
      <v-btn
        href="https://apps.apple.com/app/testflight/id899247664"
        target="_blank"
        rel="noopener"
        color="primary"
        variant="outlined"
        block
      >
        Installa TestFlight
      </v-btn>
    </v-card>

    <v-btn
      class="mt-6"
      variant="text"
      prepend-icon="mdi-logout"
      @click="logoutModule.logout(router)"
    >
      Torna al login
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import logoutModule from '@/utils/logout';

const router = useRouter();
</script>

<style scoped>
.rounded-login-logo {
  overflow: hidden;
  border-radius: 20px;
}
</style>
