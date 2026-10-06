<template>
  <landing-dialog
    id="menu"
    class="menu-dialog"
    aria-labelledby="menu-title"
    close-label="Chiudi menu"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p
      id="menu-title"
      class="kicker"
    >
      Esplora HUBSTRA
    </p>
    <nav
      class="menu-links"
      aria-label="Menu"
    >
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        @click="emit('update:modelValue', false)"
      >{{ link.label }}</a>
    </nav>
    <button
      class="button"
      @click="emit('open-demo')"
    >
      Richiedi una demo
    </button>
  </landing-dialog>
</template>

<script setup>
import LandingDialog from '@/components/landing/LandingDialog.vue';

defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'open-demo']);

const links = [
  { href: '#vantaggi', label: 'Perché HUBSTRA' },
  { href: '#piattaforma', label: 'La piattaforma' },
  { href: '#come-funziona', label: 'Come funziona' },
  { href: '#domande', label: 'Domande frequenti' }
];
</script>

<style scoped>
.menu-dialog {
  width: 650px;
  padding: 50px;
}
.menu-links {
  display: grid;
  gap: 12px;
  margin: 28px 0;
}
.menu-links a {
  font-size: 38px;
  font-weight: 500;
  letter-spacing: -1.6px;
  padding: 8px 0;
}
.menu-links a:hover {
  color: var(--blue);
}
.menu-dialog p {
  font-size: 14px;
  color: var(--muted);
}
@media (max-width: 650px) {
  .menu-dialog {
    padding: 40px 28px;
  }
  .menu-links a {
    font-size: 30px;
  }
}
</style>
