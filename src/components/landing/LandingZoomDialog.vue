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
