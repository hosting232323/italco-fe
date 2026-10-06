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

<style scoped>
.gallery-section {
  padding: 15px 0 75px;
  overflow: hidden;
}
.stage {
  position: relative;
  height: 380px;
  max-width: 1180px;
  margin: auto;
  perspective: 1500px;
  touch-action: pan-y;
}
.screen {
  width: 680px;
  height: 335px;
  position: absolute;
  top: 20px;
  left: 50%;
  margin-left: -340px;
  background: white;
  border: 1px solid #e1e1e8;
  border-radius: 22px;
  box-shadow: 0 26px 48px #1713381c;
  overflow: hidden;
  transition: transform .65s cubic-bezier(.2,.7,.2,1),opacity .65s;
  display: grid;
  grid-template-columns: 140px 1fr;
  transform: translateX(0) rotateY(0);
  opacity: 1;
}
.screen[data-pos="-1"] {
  transform: translateX(-425px) rotateY(38deg) scale(.8);
  z-index: 1;
  opacity: .38;
  pointer-events: none;
}
.screen[data-pos="1"] {
  transform: translateX(425px) rotateY(-38deg) scale(.8);
  z-index: 1;
  opacity: .38;
  pointer-events: none;
}
.screen[data-pos="0"] {
  z-index: 3;
}
.gallery-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 15px;
}
.gallery-control {
  height: 38px;
  width: 38px;
  border: 1px solid #d9d4e7;
  background: transparent;
  border-radius: 50%;
  color: var(--blue);
  font-size: 20px;
}
.dots {
  display: flex;
  gap: 8px;
}
.dots button {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  background: #cfc9e2;
  border-radius: 50%;
}
.dots button[aria-pressed="true"] {
  background: var(--blue);
  width: 23px;
  border-radius: 5px;
}
.gallery-caption {
  text-align: center;
  color: #73707a;
  font-size: 12px;
  margin: 18px 0 0;
}
@media (max-width: 1000px) {
  .screen {
    width: 600px;
    margin-left: -300px;
    grid-template-columns: 125px 1fr;
  }
  .screen[data-pos="-1"] {
    transform: translateX(-370px) rotateY(40deg) scale(.78);
  }
  .screen[data-pos="1"] {
    transform: translateX(370px) rotateY(-40deg) scale(.78);
  }
}
@media (max-width: 650px) {
  .gallery-section {
    padding-bottom: 45px;
  }
  .stage {
    height: 280px;
  }
  .screen {
    width: 340px;
    height: 255px;
    margin-left: -170px;
    grid-template-columns: 70px 1fr;
    border-radius: 14px;
    top: 15px;
  }
  .screen[data-pos="-1"] {
    transform: translateX(-260px) rotateY(38deg) scale(.8);
  }
  .screen[data-pos="1"] {
    transform: translateX(260px) rotateY(-38deg) scale(.8);
  }
}
.stage {
  height: 480px;
  max-width: 1360px;
}
.product-screen {
  width: 880px;
  height: 425px;
  margin-left: -440px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #eeeeff;
}
.product-screen img {
  display: block;
  width: 100%;
  height: calc(100% - 48px);
  object-fit: contain;
  object-position: top;
  background: #eeeefe;
}
.product-screen-caption {
  height: 48px;
  flex-shrink: 0;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 0 22px;
  font-size: 14px;
}
.zoom-screen {
  background: none;
  border: 0;
  padding: 10px 0;
  color: var(--blue);
  font-size: 13px;
}
.zoom-screen:hover {
  text-decoration: underline;
}
.screen[data-pos="2"] {
  opacity: 0;
  transform: translateX(0) translateZ(-300px) scale(.65);
  pointer-events: none;
  z-index: 0;
}
.screen[data-pos="-1"] {
  transform: translateX(-540px) rotateY(38deg) scale(.8);
}
.screen[data-pos="1"] {
  transform: translateX(540px) rotateY(-38deg) scale(.8);
}
@media (max-width: 1000px) {
  .product-screen {
    width: 700px;
    height: 355px;
    margin-left: -350px;
  }
  .stage {
    height: 405px;
  }
  .screen[data-pos="-1"] {
    transform: translateX(-460px) rotateY(38deg) scale(.8);
  }
  .screen[data-pos="1"] {
    transform: translateX(460px) rotateY(-38deg) scale(.8);
  }
}
@media (max-width: 650px) {
  .stage {
    height: 245px;
  }
  .product-screen {
    width: min(90vw,500px);
    height: 215px;
    margin-left: 0;
    left: 5vw;
    border-radius: 12px;
  }
  .product-screen img {
    height: calc(100% - 42px);
  }
  .product-screen-caption {
    height: 42px;
    font-size: 12px;
    padding: 0 13px;
  }
  .zoom-screen {
    font-size: 12px;
  }
  .screen[data-pos="-1"] {
    transform: translateX(-90vw) rotateY(30deg) scale(.8);
  }
  .screen[data-pos="1"] {
    transform: translateX(90vw) rotateY(-30deg) scale(.8);
  }
  .gallery-caption {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }
}
</style>
