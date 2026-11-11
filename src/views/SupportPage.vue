<template>
  <div
    ref="root"
    class="landing"
  >
    <landing-header
      @open-menu="openDialog('menu')"
      @open-demo="openDialog('demo')"
    />
    <main class="support">
      <div class="container">
        <article class="support-text">
          <p class="kicker">
            Siamo qui per aiutarti.
          </p>
          <h1>Assistenza</h1>
          <p class="support-sub">
            App Hubstra Delivery e piattaforma Hubstra
          </p>
          <h2>Sei un corriere?</h2>
          <p>Per problemi di accesso, come una password dimenticata o un account bloccato, rivolgiti prima all’<strong>amministratore della tua attività</strong>: è lui che crea e gestisce gli account dei corrieri. Se non riesci a contattarlo, scrivici.</p>
          <h2>Come contattarci</h2>
          <p>
            Scrivi a
            <a
              v-if="supportEmail"
              :href="`mailto:${supportEmail}`"
            >{{ supportEmail }}</a>
            <strong v-else>[DA COMPLETARE: email di assistenza]</strong>.
          </p>
          <h2>Prima di scriverci</h2>
          <p>Per aiutarti più in fretta indica:</p>
          <ul>
            <li>nome e cognome e l’azienda per cui lavori</li>
            <li>il telefono che usi (iPhone o Android)</li>
            <li>la versione dell’app, che trovi in fondo alla schermata del tuo profilo</li>
            <li>che cosa stavi facendo quando è comparso il problema, con uno screenshot se puoi</li>
          </ul>
          <h2>Privacy e dati personali</h2>
          <p>Per le richieste sui tuoi dati personali consulta l’<a href="/privacy">informativa sulla privacy</a>.</p>
          <h2>Vuoi usare Hubstra nella tua azienda?</h2>
          <p>Scopri come funziona e richiedi una demo dalla <a href="/">pagina principale</a>.</p>
        </article>
      </div>
    </main>
    <landing-footer @open-policy="openDialog('cookie')" />
    <landing-menu-dialog
      v-model="dialogs.menu"
      @open-demo="openDialog('demo')"
    />
    <landing-demo-dialog v-model="dialogs.demo" />
    <landing-cookie-dialog v-model="dialogs.cookie" />
  </div>
</template>

<script setup>
import '@/styles/landing.css';
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import LandingCookieDialog from '@/components/landing/LandingCookieDialog.vue';
import LandingDemoDialog from '@/components/landing/LandingDemoDialog.vue';
import LandingFooter from '@/components/landing/LandingFooter.vue';
import LandingHeader from '@/components/landing/LandingHeader.vue';
import LandingMenuDialog from '@/components/landing/LandingMenuDialog.vue';

// Email di assistenza pubblica. Vuota = la pagina mostra il segnaposto: non va online senza.
const supportEmail = 'assistenza@hubstra.it';

const previousTitle = document.title;

const dialogs = reactive({ menu: false, demo: false, cookie: false });
const anyDialogOpen = computed(() => Object.values(dialogs).some(Boolean));

// Menu e demo si escludono a vicenda; l'informativa cookie si apre sopra a quello che c'è.
const openDialog = (name) => {
  if (name !== 'cookie')
    dialogs.menu = dialogs.demo = false;
  dialogs[name] = true;
};

watch(anyDialogOpen, (open) => document.body.classList.toggle('landing-lock', open));

onMounted(() => {
  document.title = 'Assistenza — HUBSTRA';
  document.documentElement.classList.add('landing-page');
});

onBeforeUnmount(() => {
  document.title = previousTitle;
  document.documentElement.classList.remove('landing-page');
  document.body.classList.remove('landing-lock');
});
</script>

<style scoped>
.support {
  padding: 150px 0 110px;
}
.support-text {
  max-width: 820px;
  margin-inline: auto;
}
.support-text h1 {
  font-size: clamp(40px,4.7vw,65px);
  line-height: 1.08;
  letter-spacing: -3px;
  font-weight: 600;
  margin: 0 0 22px;
}
.support-sub {
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 8px;
}
.support-text h2 {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -1px;
  line-height: 1.25;
  margin: 56px 0 14px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.support-text p,
.support-text li {
  font-size: 16px;
  line-height: 1.75;
  color: #625b70;
}
.support-text p {
  margin: 0 0 14px;
}
.support-text strong {
  color: var(--ink);
  font-weight: 600;
}
.support-text ul {
  margin: 0 0 14px;
  padding-left: 22px;
}
.support-text li {
  margin-bottom: 8px;
}
.support-text a {
  color: var(--blue);
  text-decoration: underline;
}
@media (max-width: 650px) {
  .support {
    padding: 120px 0 80px;
  }
  .support-text h1 {
    font-size: 39px;
    letter-spacing: -2px;
  }
  .support-sub {
    font-size: 16px;
  }
  .support-text h2 {
    font-size: 22px;
    margin-top: 44px;
  }
  .support-text p,
  .support-text li {
    font-size: 15px;
  }
}
</style>
