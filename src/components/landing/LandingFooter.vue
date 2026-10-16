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

<style scoped>
.footer {
  background: var(--blue);
  color: white;
  padding: 60px 0 22px;
  overflow: hidden;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
.footer-top p {
  font-size: 17px;
  line-height: 1.6;
  color: #d1c8ff;
  margin: 0;
  max-width: 330px;
}
.footer-top a {
  font-size: 14px;
  color: #dfd7ff;
}
.footer-brand {
  font-size: clamp(60px,16.5vw,255px);
  font-weight: 700;
  letter-spacing: -.065em;
  line-height: 1.1;
  text-align: center;
  margin: 45px 0 25px;
  white-space: nowrap;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ffffff35;
  padding-top: 20px;
  font-size: 12px;
  color: #c6bdff;
  gap: 20px;
}
@media (max-width: 650px) {
  .footer {
    padding-top: 40px;
  }
  .footer-top p {
    font-size: 15px;
    max-width: 220px;
  }
  .footer-brand {
    font-size: 16vw;
    margin: 40px 0 24px;
  }
  .footer-bottom {
    font-size: 11px;
    line-height: 1.6;
  }
}
.legal-links {
  display: flex;
  gap: 20px;
}
.legal-links a:hover {
  text-decoration: underline;
}
</style>
