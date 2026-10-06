<template>
  <section
    class="gallery-section"
    aria-label="Esplora le funzioni di HUBSTRA"
  >
    <div
      class="stage"
      tabindex="0"
      role="region"
      aria-roledescription="carosello"
      aria-label="Anteprime della piattaforma, usa i pulsanti o le frecce della tastiera"
      @keydown="onKeydown"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <article
        v-for="(screen, i) in screens"
        :key="screen.title"
        class="screen product-screen"
        :data-pos="position(i)"
        role="group"
        :aria-label="`${i + 1} di ${screens.length}: ${screen.title}`"
        :aria-hidden="String(position(i) !== 0)"
        :inert="position(i) !== 0"
      >
        <img
          :src="screen.image"
          :alt="`Schermata ${screen.title} di HUBSTRA con dati dimostrativi`"
          width="1536"
          height="1024"
          decoding="async"
        >
        <div class="product-screen-caption">
          <span>{{ screen.title }}</span>
          <button
            type="button"
            class="zoom-screen"
            :aria-label="`Ingrandisci ${screen.title}`"
            @click="emit('zoom', screen)"
          >
            Ingrandisci
          </button>
        </div>
      </article>
    </div>
    <div class="gallery-bottom">
      <button
        class="gallery-control"
        aria-label="Anteprima precedente"
        @click="setSlide(current - 1)"
      >
        ‹
      </button>
      <div
        class="dots"
        aria-label="Seleziona anteprima"
      >
        <button
          v-for="(screen, i) in screens"
          :key="screen.title"
          :aria-label="screen.title"
          :aria-pressed="String(i === current)"
          @click="setSlide(i)"
        />
      </div>
      <button
        class="gallery-control"
        aria-label="Anteprima successiva"
        @click="setSlide(current + 1)"
      >
        ›
      </button>
    </div>
    <p
      class="gallery-caption"
      aria-live="polite"
    >
      {{ screens[current].caption }} · Dati dimostrativi
    </p>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['zoom']);

const screens = [
  {
    title: 'Dashboard e indicatori',
    image: '/landing/dashboard-demo.png',
    caption: 'Dashboard: ordini, consegne e indicatori'
  },
  {
    title: 'Gestione RAEE',
    image: '/landing/raee-demo.png',
    caption: 'RAEE: dall’emissione allo smaltimento'
  },
  {
    title: 'Copertura corrieri',
    image: '/landing/copertura-corrieri-demo.png',
    caption: 'Copertura corrieri: calendario e fasce operative'
  },
  {
    title: 'Gestione ordini',
    image: '/landing/ordini-demo.png',
    caption: 'Ordini: destinatari, appuntamenti e attività'
  }
];

const current = ref(0);
let touchStart = null;

const setSlide = (n) => {
  current.value = (n + screens.length) % screens.length;
};

// 0 = schermata visibile, -1 = quella che sta dietro a sinistra.
const position = (i) => {
  const p = (i - current.value + screens.length) % screens.length;
  return p === screens.length - 1 ? -1 : p;
};

const onKeydown = (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')
    return;
  e.preventDefault();
  setSlide(current.value + (e.key === 'ArrowRight' ? 1 : -1));
};

const onTouchStart = (e) => {
  touchStart = e.changedTouches[0].clientX;
};

const onTouchEnd = (e) => {
  if (touchStart === null)
    return;
  const delta = e.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 45)
    setSlide(current.value + (delta < 0 ? 1 : -1));
  touchStart = null;
};
</script>
