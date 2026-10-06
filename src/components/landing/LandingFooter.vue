<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <p>Data e fascia già alla vendita.<br>Ordini, consegne e RAEE nello stesso gestionale.</p>
        <a href="#inizio">Torna all’inizio ↑</a>
      </div>
      <div
        class="footer-brand"
        aria-hidden="true"
      >
        HUBSTRA
      </div>
      <div class="footer-bottom">
        <span>© 2026 HUBSTRA</span>
        <div class="legal-links">
          <a
            href="#privacy"
            @click.prevent="emit('open-policy', 'privacy')"
          >Privacy</a>
          <a
            href="#cookie"
            @click.prevent="emit('open-policy', 'cookie')"
          >Cookie</a>
          <a
            href="https://fastsite.it"
            target="_blank"
            rel="noopener"
          >Powered by Fast-Site</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const emit = defineEmits(['open-policy']);
</script>
