<template>
  <section
    id="demo"
    class="cta container reveal"
  >
    <p class="kicker">
      Guarda HUBSTRA sul tuo flusso di lavoro.
    </p>
    <h2>
      Le tue consegne.<br>Vediamole <em class="serif">con HUBSTRA.</em>
    </h2>
    <p>Raccontaci come gestisci ordini, punti vendita e squadre. In demo ti mostriamo le funzioni utili al tuo lavoro, dagli appuntamenti alle proforma.</p>
    <button
      class="button"
      @click="emit('open-demo')"
    >
      Richiedi una demo
    </button>
  </section>
</template>

<script setup>
const emit = defineEmits(['open-demo']);
</script>

<style scoped>
.cta {
  padding: 75px 0 110px;
  text-align: center;
}
.cta h2 {
  font-size: clamp(42px,5vw,72px);
  font-weight: 550;
  line-height: 1.05;
  letter-spacing: -3px;
  margin: 0 0 25px;
}
.cta p {
  font-size: 18px;
  color: var(--muted);
  line-height: 1.65;
  margin: 0 auto 25px;
  max-width: 560px;
}
@media (max-width: 650px) {
  .cta {
    padding: 55px 0 75px;
  }
  .cta h2 {
    font-size: 44px;
    letter-spacing: -2.5px;
  }
  .cta p {
    font-size: 16px;
  }
}
</style>
