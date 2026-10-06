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
import '@/views/landing/landing.css';

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
