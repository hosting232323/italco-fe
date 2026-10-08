<template>
  <div
    ref="root"
    class="landing"
  >
    <landing-header
      @open-menu="openDialog('menu')"
      @open-demo="openDialog('demo')"
    />
    <main id="inizio">
      <landing-hero @open-demo="openDialog('demo')" />
      <landing-gallery @zoom="openZoom" />
      <landing-partners />
      <landing-advantages />
      <landing-features />
      <landing-workflow />
      <landing-faq />
      <landing-cta @open-demo="openDialog('demo')" />
    </main>
    <landing-footer @open-policy="openPolicy" />
    <landing-menu-dialog
      v-model="dialogs.menu"
      @open-demo="openDialog('demo')"
    />
    <landing-demo-dialog
      v-model="dialogs.demo"
      @open-policy="openPolicy"
    />
    <landing-privacy-dialog v-model="dialogs.privacy" />
    <landing-cookie-dialog
      v-model="dialogs.cookie"
      @open-policy="openPolicy"
    />
    <landing-zoom-dialog
      v-model="dialogs.zoom"
      :screen="zoomedScreen"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import LandingAdvantages from '@/components/landing/LandingAdvantages.vue';
import LandingCookieDialog from '@/components/landing/LandingCookieDialog.vue';
import LandingCta from '@/components/landing/LandingCta.vue';
import LandingDemoDialog from '@/components/landing/LandingDemoDialog.vue';
import LandingFaq from '@/components/landing/LandingFaq.vue';
import LandingFeatures from '@/components/landing/LandingFeatures.vue';
import LandingFooter from '@/components/landing/LandingFooter.vue';
import LandingGallery from '@/components/landing/LandingGallery.vue';
import LandingHeader from '@/components/landing/LandingHeader.vue';
import LandingHero from '@/components/landing/LandingHero.vue';
import LandingMenuDialog from '@/components/landing/LandingMenuDialog.vue';
import LandingPartners from '@/components/landing/LandingPartners.vue';
import LandingPrivacyDialog from '@/components/landing/LandingPrivacyDialog.vue';
import LandingWorkflow from '@/components/landing/LandingWorkflow.vue';
import LandingZoomDialog from '@/components/landing/LandingZoomDialog.vue';

const root = ref(null);
const previousTitle = document.title;
let observer = null;

const dialogs = reactive({ menu: false, demo: false, zoom: false, privacy: false, cookie: false });
const zoomedScreen = ref(null);
const anyDialogOpen = computed(() => Object.values(dialogs).some(Boolean));

// Menu, demo e zoom si escludono a vicenda; le informative si aprono sopra a quello che c'è.
const openDialog = (name) => {
  dialogs.menu = dialogs.demo = dialogs.zoom = false;
  dialogs[name] = true;
};
const openPolicy = (name) => {
  dialogs[name] = true;
};
const openZoom = (screen) => {
  zoomedScreen.value = screen;
  openDialog('zoom');
};

watch(anyDialogOpen, (open) => document.body.classList.toggle('landing-lock', open));

onMounted(() => {
  document.title = 'HUBSTRA — Data e fascia di consegna già alla vendita.';
  document.documentElement.classList.add('landing-page');
  observeReveal();
});

onBeforeUnmount(() => {
  document.title = previousTitle;
  document.documentElement.classList.remove('landing-page');
  document.body.classList.remove('landing-lock');
  observer?.disconnect();
});

// Comparsa delle sezioni allo scroll.
const observeReveal = () => {
  const items = root.value.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('visible'));
    return;
  }
  observer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }), { threshold: .08 });
  items.forEach((item) => observer.observe(item));
};
</script>

<!-- Non scoped: variabili, reset e classi condivise dai componenti della landing, più html/body. -->
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
/* Stile della landing HUBSTRA: ogni regola e' sotto .landing per non toccare il resto dell'app. */
/* HUBSTRA — stile della home, componenti e layout responsive. */
.landing {
  --blue: #2100df;
  --deep: #16009c;
  --paper: #fafafa;
  --ink: #111;
  --muted: #626269;
  --line: #ddd;
  --radius: 28px;
}
.landing * {
  box-sizing: border-box;
}
html.landing-page {
  scroll-behavior: smooth;
  scroll-padding-top: 110px;
}
.landing {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: "Helvetica Neue",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
}
body.landing-lock {
  overflow: hidden;
}
.landing button,
.landing input,
.landing select,
.landing textarea {
  font: inherit;
}
.landing button,
.landing a {
  -webkit-tap-highlight-color: transparent;
}
.landing button {
  cursor: pointer;
}
.landing a {
  color: inherit;
  text-decoration: none;
}
.landing button:focus-visible,
.landing a:focus-visible,
.landing summary:focus-visible,
.landing input:focus-visible,
.landing textarea:focus-visible,
.landing select:focus-visible {
  outline: 3px solid #785eff;
  outline-offset: 5px;
}
.landing button:disabled {
  cursor: default;
}
.landing .container {
  width: min(1240px,calc(100% - 104px));
  margin-inline: auto;
}
.landing .button {
  border: 0;
  background: var(--blue);
  color: white;
  border-radius: 10px;
  padding: 16px 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  font-size: 14px;
  transition: transform .2s,background .2s;
}
.landing .button:hover {
  background: var(--deep);
  transform: translateY(-2px);
}
.landing .button.outline {
  background: none;
  color: var(--blue);
  border: 1px solid #cbc3f5;
}
.landing .kicker {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  margin: 0 0 30px;
}
.landing .serif {
  font-family: Georgia,"Times New Roman",serif;
  font-weight: 400;
  font-style: italic;
  letter-spacing: -.065em;
  color: var(--blue);
}
.landing .section-title {
  text-align: center;
  max-width: 900px;
  margin: auto;
}
.landing .section-title h2 {
  font-size: clamp(40px,4.7vw,65px);
  line-height: 1.08;
  letter-spacing: -3px;
  font-weight: 600;
  margin: 0 0 25px;
}
.landing .section-title p {
  font-size: 18px;
  color: var(--muted);
  line-height: 1.6;
  max-width: 620px;
  margin: auto;
}
.landing details p {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.75;
  margin: 0 45px 25px 0;
}
.landing .reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .75s,transform .75s;
}
.landing .reveal.visible {
  opacity: 1;
  transform: none;
}
.landing dialog {
  margin: auto;
  border: 0;
  color: var(--ink);
  padding: 0;
  border-radius: 24px;
  background: var(--paper);
  max-width: calc(100% - 28px);
}
.landing dialog::backdrop {
  background: #160c355c;
  backdrop-filter: blur(7px);
}
@media (max-width: 1000px) {
  .landing .container {
    width: calc(100% - 60px);
  }
}
@media (max-width: 650px) {
  html.landing-page {
    scroll-padding-top: 90px;
  }
  .landing .container {
    width: calc(100% - 40px);
  }
  .landing .kicker {
    font-size: 11px;
    letter-spacing: 1.5px;
    margin-bottom: 25px;
  }
  .landing .section-title h2 {
    font-size: 39px;
    letter-spacing: -2px;
  }
  .landing .section-title p {
    font-size: 16px;
  }
  .landing details p {
    margin-right: 15px;
    font-size: 15px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html.landing-page {
    scroll-behavior: auto;
  }
  .landing *,
  .landing *:before,
  .landing *:after {
    transition: none!important;
    animation: none!important;
  }
  .landing .reveal {
    opacity: 1;
    transform: none;
  }
}
.landing .legal-dialog {
  width: 820px;
  max-height: 88dvh;
  overflow: auto;
  padding: 46px;
}
.landing .legal-dialog h2 {
  font-size: 38px;
  letter-spacing: -1.5px;
  margin: 0 0 20px;
}
.landing .legal-dialog h3 {
  font-size: 20px;
  font-weight: 500;
  margin: 30px 0 12px;
}
.landing .legal-dialog p {
  font-size: 16px;
  line-height: 1.75;
  color: #625b70;
}
.landing .legal-dialog a,
.landing .privacy-short a {
  color: var(--blue);
  text-decoration: underline;
}
.landing .legal-dialog .legal-date {
  font-size: 13px;
}
.landing .legal-draft {
  border: 1px solid #d8cfee;
  background: #f0eafa;
  padding: 16px;
  border-radius: 10px;
}
@media (max-width: 650px) {
  .landing .legal-dialog {
    padding: 42px 25px;
  }
  .landing .legal-dialog h2 {
    font-size: 30px;
  }
  .landing .legal-dialog h3 {
    font-size: 18px;
  }
  .landing .legal-dialog p {
    font-size: 15px;
  }
}
/* Barra di scorrimento dentro il riquadro: scorre il contenuto interno e il
   dialog resta un rettangolo pieno con gli angoli arrotondati. */
.landing .demo-dialog,
.landing .legal-dialog {
  padding: 0;
  overflow: hidden;
}
.landing .dialog-scroll {
  max-height: calc(90dvh - 24px);
  overflow-y: auto;
  margin: 12px 8px 12px 0;
  scrollbar-width: thin;
  scrollbar-color: #cfc9e2 transparent;
}
.landing .legal-dialog .dialog-scroll {
  padding: 34px 38px 34px 46px;
}
@media (max-width: 650px) {
  .landing .legal-dialog .dialog-scroll {
    padding: 30px 17px 30px 25px;
  }
}
</style>
