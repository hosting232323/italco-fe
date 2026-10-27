<template>
  <v-app>
    <!-- Attivita' bloccata: al posto dell'app c'e' solo il messaggio (e, per chi
    puo', il pagamento che sblocca). Il backend rifiuta comunque ogni richiesta. -->
    <AppBar v-if="companyBlocked" />
    <v-main
      v-if="companyBlocked"
      :style="{ backgroundColor: theme.current.value.pageColor }"
    >
      <BlockedCompany />
    </v-main>
    <NavigationDrawer v-if="!companyBlocked" />
    <v-main
      v-if="!companyBlocked"
      :style="{ backgroundColor: theme.current.value.pageColor }"
    >
      <router-view />
      <!-- <ChattyBot
        :hostname="http.hostname"
        :bot-data="botItalco"
        :http="http"
      /> -->
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
// import http from '@/utils/http';
// import { ChattyBot } from 'generic-module';

import AppBar from '@/layouts/AppBar';
import Footer from '@/layouts/FooterBar';
import NavigationDrawer from '@/layouts/NavigationDrawer';
import BlockedCompany from '@/components/BlockedCompany';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCompanyConfigurationStore } from '@/stores/companyConfiguration';

const theme = useTheme();
const userStore = useUserStore();
const { companyBlocked } = storeToRefs(userStore);

// L'attivita' salvata nel browser viene dal login: a ogni apertura dell'app si
// rilegge, cosi' un blocco (o uno sblocco) avvenuto dopo il login si vede subito
// anche su pagine, come la configurazione, che il blocco non fa fallire.
onMounted(() => {
  if (userStore.role && userStore.role != 'Super Admin' && userStore.company)
    useCompanyConfigurationStore().syncSession();
});

// const botItalco = {
//   name: 'Italco.mi Bot',
//   image: '/logo.png',
//   session: true,
//   message: 'Ciao! Sono qui per rispondere alle tue domande sugli ordini.<br>Chiedimi quello che ti serve sapere specificando la data di creazione degli ordini interessati.',
//   color: {
//     theme_color: '#354c7c',
//     theme_color_hover: '#46639e',
//     fab_hover: '#46639e',
//     fab_shadow: '#9daccd',
//     fab_border: '#26375a'
//   }
// };
</script>
