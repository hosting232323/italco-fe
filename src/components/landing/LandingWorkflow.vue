<template>
  <section
    id="come-funziona"
    class="workflow container"
  >
    <div class="section-title reveal">
      <p class="kicker">
        Punto vendita, ufficio e squadre.
      </p>
      <h2>
        Tre ruoli.<br>Una gestione <em class="serif">condivisa.</em>
      </h2>
    </div>
    <div class="steps">
      <article
        v-for="step in steps"
        :key="step.label"
        class="step reveal"
      >
        <span>{{ step.label }}</span>
        <h3>{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    label: '01 / IL PUNTO VENDITA',
    title: 'Comunica l’appuntamento alla vendita.',
    text: 'Consulta le disponibilità pianificate e comunica al consumatore data e fascia oraria mentre acquista. Il cliente può organizzarsi per ricevere la consegna.'
  },
  {
    label: '02 / IL TUO UFFICIO',
    title: 'Organizza le attività e segue gli esiti.',
    text: 'Importa gli ordini, pianifica le zone e le fasce, assegna le consegne e genera i borderò. Riceve le segnalazioni e gestisce RAEE, listini e proforma.'
  },
  {
    label: '03 / LA SQUADRA',
    title: 'Documenta la consegna dal campo.',
    text: 'Consulta le attività assegnate, raccoglie foto e firma grafica e registra l’esito dell’intervento. L’ufficio riceve le comunicazioni sulle anomalie.'
  }
];
</script>
