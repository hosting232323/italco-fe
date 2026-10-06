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
