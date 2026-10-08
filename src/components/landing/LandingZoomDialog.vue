<template>
  <landing-dialog
    id="screen-zoom"
    class="zoom-dialog"
    aria-labelledby="zoom-title"
    close-label="Chiudi schermata"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <h2 id="zoom-title">
      {{ screen?.title }}
    </h2>
    <img
      :src="screen?.image"
      :alt="screen ? `Schermata ${screen.title} di HUBSTRA con dati dimostrativi` : ''"
    >
    <p>Anteprima del gestionale · Tutti i dati mostrati sono dimostrativi.</p>
  </landing-dialog>
</template>

<script setup>
import LandingDialog from '@/components/landing/LandingDialog.vue';

defineProps({
  modelValue: { type: Boolean, default: false },
  screen: { type: Object, default: null }
});
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.zoom-dialog {
  width: min(1500px,96vw);
  max-height: 94dvh;
  padding: 50px 20px 20px;
  background: #fafafa;
}
.zoom-dialog h2 {
  font-size: 20px;
  margin: 0 40px 20px 0;
  font-weight: 500;
}
.zoom-dialog img {
  width: 100%;
  height: auto;
  max-height: calc(94dvh - 140px);
  object-fit: contain;
  display: block;
  background: #eeeefe;
}
.zoom-dialog p {
  font-size: 12px;
  color: #777;
  margin: 15px 0 0;
}
@media (max-width: 650px) {
  .zoom-dialog {
    padding: 50px 12px 18px;
  }
  .zoom-dialog h2 {
    font-size: 17px;
  }
}
</style>
