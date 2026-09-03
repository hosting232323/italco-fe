<template>
  <div ref="loginCard">
    <AuthManager
      class="mt-10 rounded-login-logo"
      title="Login"
      logo="/ares-app-icon.png"
      :secondary-color="theme.current.value.primaryColor"
      :sign-up="false"
      :hostname="hostname"
      @call-back="goToDashboard"
    />
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { AuthManager } from 'generic-module';
import { useUserStore } from '@/stores/user';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const hostname = import.meta.env.VITE_HOSTNAME;

// AuthManager (generic-module) mostra l'errore del login come testo semplice:
// non c'è modo di passargli un link. Questa frase deve restare identica al
// messaggio che manda italco-be per il login Delivery dal web (vedi
// TRANSPORT_HEADER in src/end_points/users/__init__.py) o lo split sotto
// smette di trovarla e l'alert torna semplice testo, senza rompersi.
const DELIVERY_LINK_TEXT = 'l\'app Ares Delivery';

const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const loginCard = ref(null);
let alertObserver;

const { role, userId, token, company } = storeToRefs(userStore);

// Trasforma "...usa l'app Ares Delivery" nell'alert di errore in un link
// vero verso la pagina di download, senza toccare generic-module (libreria
// condivisa con altri progetti): si osserva il DOM che produce e si separa
// solo il testo dentro .v-alert__content, lasciando intatta la chrome
// dell'alert (icona, sfondo) che Vuetify disegna intorno.
const linkifyDeliveryAlert = () => {
  const content = loginCard.value?.querySelector('.v-alert__content');
  if (!content || content.dataset.deliveryLinked) return;

  const parts = content.textContent.split(DELIVERY_LINK_TEXT);
  if (parts.length !== 2) return;

  content.dataset.deliveryLinked = 'true';
  content.textContent = '';
  content.append(document.createTextNode(parts[0]));

  const link = document.createElement('a');
  link.textContent = DELIVERY_LINK_TEXT;
  link.href = router.resolve({ name: 'Download App' }).href;
  link.style.textDecoration = 'underline';
  link.addEventListener('click', (event) => {
    event.preventDefault();
    router.push({ name: 'Download App' });
  });
  content.append(link, document.createTextNode(parts[1]));
};

onMounted(() => {
  alertObserver = new MutationObserver(linkifyDeliveryAlert);
  alertObserver.observe(loginCard.value, { childList: true, subtree: true, characterData: true });
});

onBeforeUnmount(() => alertObserver?.disconnect());

const goToDashboard = (data) => {
  // Difesa in profondità: il backend rifiuta già il login Delivery dal web
  // (vedi TRANSPORT_HEADER in italco-be), ma se un token Delivery arrivasse
  // comunque qui non c'è più una UI ad accoglierlo.
  if (data.role === 'Delivery') {
    userStore.$reset();
    router.push({ name: 'Download App' });
    return;
  }

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
