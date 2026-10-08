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

<style scoped>
.hero {
  padding: 190px 0 40px;
  text-align: center;
}
.hero h1 {
  font-size: clamp(55px,6.4vw,90px);
  line-height: 1.04;
  font-weight: 650;
  letter-spacing: -5px;
  max-width: 1090px;
  margin: 0 auto 30px;
}
.hero p.lead {
  font-size: 19px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 630px;
  margin: 0 auto 30px;
}
.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 13px;
}
.hero-note {
  font-size: 12px;
  color: #74747c;
  margin: 20px 0 0;
}
@media (min-width: 1600px) {
  .hero {
    padding-top: 220px;
  }
  .hero h1 {
    font-size: 96px;
  }
}
@media (max-width: 1000px) {
  .hero h1 {
    letter-spacing: -3.5px;
  }
}
@media (max-width: 650px) {
  .hero {
    padding: 140px 0 25px;
  }
  .hero h1 {
    font-size: 49px;
    line-height: 1.06;
    letter-spacing: -2.8px;
  }
  .hero p.lead {
    font-size: 16px;
    line-height: 1.7;
  }
  .hero-buttons {
    gap: 10px;
  }
  .hero-buttons .button {
    font-size: 13px;
    padding: 14px 16px;
  }
  .hero-note {
    line-height: 1.6;
    margin-top: 18px;
  }
}
</style>
