<template>
  <section
    id="domande"
    class="faq-section container"
  >
    <div class="section-title reveal">
      <h2>
        Prima della demo,<br>
        <em class="serif">qualche risposta.</em>
      </h2>
      <p>Come funziona HUBSTRA e quali attività puoi gestire.</p>
    </div>
    <div class="faq reveal">
      <details
        v-for="item in faq"
        :key="item.question"
      >
        <summary>{{ item.question }}</summary>
        <p>{{ item.answer }}</p>
      </details>
    </div>
  </section>
</template>

<script setup>
const faq = [
  {
    question: 'Come viene definita la fascia al momento della vendita?',
    answer: 'Il punto vendita consulta le disponibilità definite nella pianificazione operativa. In questo modo può comunicare al consumatore data e fascia di consegna già all’acquisto. Le disponibilità dipendono dalle zone e dalle fasce che hai organizzato.'
  },
  {
    question: 'Chi può utilizzare HUBSTRA?',
    answer: 'Puoi creare utenti per punti vendita, consegnatari e operatori. Il punto vendita gestisce gli appuntamenti alla vendita, l’ufficio organizza il lavoro e le squadre consultano e documentano le attività assegnate.'
  },
  {
    question: 'Quali comunicazioni posso automatizzare?',
    answer: 'Puoi gestire SMS automatici al consumatore. Le anomalie e le consegne da riprogrammare vengono comunicate via email in tempo reale al tuo ufficio e ai committenti.'
  },
  {
    question: 'Come vengono documentate le consegne?',
    answer: 'La squadra raccoglie foto durante l’intervento e la firma grafica del cliente, e registra l’esito della consegna. Le informazioni restano associate all’attività svolta.'
  },
  {
    question: 'Quali file posso importare ed esportare?',
    answer: 'Puoi importare ordini da Excel e PDF ed esportare i dati in Excel. I borderò per le consegne sono disponibili in PDF. In demo possiamo esaminare i tuoi formati e mostrarti il flusso di lavoro.'
  },
  {
    question: 'Quali fasi dei RAEE posso gestire?',
    answer: 'HUBSTRA gestisce i RAEE dall’emissione della documentazione fino allo smaltimento. Le schermate dedicate consentono di consultare i ritiri e i relativi stati.'
  },
  {
    question: 'Posso impostare tariffe diverse per ciascun committente?',
    answer: 'Sì. Puoi creare un listino per ogni committente. Le prestazioni vengono valorizzate secondo le tariffe impostate e puoi scaricare le proforma di fine mese.'
  }
];
</script>

<style scoped>
.faq-section {
  padding: 70px 0 110px;
}
.faq {
  max-width: 800px;
  margin: 50px auto 0;
}
details {
  border-bottom: 1px solid #d4d1dd;
}
summary {
  list-style: none;
  cursor: pointer;
  padding: 25px 38px 25px 0;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -.5px;
  position: relative;
}
summary::-webkit-details-marker {
  display: none;
}
summary:after {
  content: '+';
  position: absolute;
  right: 3px;
  top: 23px;
  font-size: 24px;
  color: #847a9d;
  font-weight: 300;
}
details[open] summary:after {
  content: '−';
}
@media (max-width: 650px) {
  .faq-section {
    padding: 50px 0;
  }
  .faq {
    margin-top: 28px;
  }
  summary {
    font-size: 17px;
    line-height: 1.5;
    padding-top: 22px;
    padding-bottom: 22px;
  }
}
</style>
