<template>
  <section class="hero container">
    <p class="kicker">
      Il gestionale per clienti più soddisfatti.
    </p>
    <h1>
      Il cliente acquista.<br>Sa già <em class="serif">quando consegni.</em>
    </h1>
    <p class="lead">
      Con HUBSTRA, il punto vendita comunica data e fascia di consegna già al momento dell’acquisto, in base alle disponibilità pianificate. Il tuo ufficio e le squadre gestiscono le attività nella stessa piattaforma.
    </p>
    <div class="hero-buttons">
      <button
        class="button"
        @click="emit('open-demo')"
      >
        Richiedi una demo
      </button>
      <a
        class="button outline"
        href="#piattaforma"
      >Esplora la piattaforma</a>
    </div>
    <p class="hero-note">
      Appuntamenti, consegne, RAEE e proforma. Un unico gestionale.
    </p>
  </section>
</template>

<script setup>
const emit = defineEmits(['open-demo']);
</script>
