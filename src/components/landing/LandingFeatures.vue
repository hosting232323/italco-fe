<template>
  <section
    id="piattaforma"
    class="features-section container"
  >
    <div class="section-title reveal">
      <p class="kicker">
        Prima, durante e dopo la consegna.
      </p>
      <h2>
        Ogni fase del lavoro.<br>
        <em class="serif">Nello stesso gestionale.</em>
      </h2>
      <p>Dai al cliente una data e una fascia. Al tuo ufficio, gli strumenti per organizzare il lavoro. Alle squadre, le informazioni per svolgerlo e documentarlo.</p>
    </div>
    <div class="features">
      <article
        v-for="feature in features"
        :key="feature.label"
        class="feature reveal"
      >
        <span class="num">{{ feature.label }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    label: '01 / APPUNTAMENTI',
    title: 'Data e fascia, già alla vendita.',
    text: 'Il punto vendita consulta le disponibilità e comunica al consumatore data e fascia di consegna mentre acquista. L’appuntamento si basa sulla tua pianificazione operativa.'
  },
  {
    label: '02 / IMPORT ED EXPORT',
    title: 'Dai file agli ordini da gestire.',
    text: 'Importi gli ordini da Excel e PDF, senza doverli inserire tutti singolarmente. Esporti i dati in Excel per elaborarli o condividerli.'
  },
  {
    label: '03 / PIANIFICAZIONE',
    title: 'Ogni consegna, alla sua squadra.',
    text: 'Definisci zone e fasce operative e assegni le consegne agli equipaggi. Le disponibilità pianificate diventano il riferimento per gli appuntamenti alla vendita.'
  },
  {
    label: '04 / BORDERÒ PDF',
    title: 'Le attività assegnate diventano un borderò.',
    text: 'HUBSTRA genera automaticamente i borderò con le consegne della squadra. Hai i documenti in PDF per accompagnare la fase di consegna.'
  },
  {
    label: '05 / SMS ED EMAIL',
    title: 'Le comunicazioni partono dal gestionale.',
    text: 'Gestisci gli SMS automatici al consumatore. Anomalie e consegne da riprogrammare vengono comunicate via email in tempo reale all’ufficio e ai tuoi committenti.'
  },
  {
    label: '06 / FOTO E FIRMA',
    title: 'La consegna resta documentata.',
    text: 'Raccogli le foto in fase di consegna e la firma grafica del cliente. Le prove sono associate all’intervento, insieme al suo esito.'
  },
  {
    label: '07 / GESTIONE RAEE',
    title: 'Dal documento allo smaltimento.',
    text: 'Gestisci i RAEE dall’emissione della documentazione fino allo smaltimento. Segui le relative attività e gli stati nel gestionale, insieme alle consegne.'
  },
  {
    label: '08 / ACCESSI UTENTE',
    title: 'Un accesso per ogni persona coinvolta.',
    text: 'Crei più utenti per punti vendita, consegnatari e operatori. Le persone coinvolte accedono allo stesso gestionale per svolgere le proprie attività.'
  },
  {
    label: '09 / LISTINI E PROFORMA',
    title: 'Ogni cliente ha il suo listino.',
    text: 'Imposti tariffe diverse per ciascun committente. HUBSTRA valorizza le prestazioni secondo il listino e ti permette di scaricare le proforma a fine mese.'
  }
];
</script>

<style scoped>
.features-section {
  padding-bottom: 100px;
}
.features {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 18px;
  margin-top: 55px;
}
.feature {
  background: #f0eef8;
  border-radius: 22px;
  padding: 34px;
  min-height: 280px;
  transition: background .3s,transform .3s;
}
.feature:hover {
  background: #e8e2fc;
  transform: translateY(-5px);
}
.feature .num {
  font-size: 12px;
  color: var(--blue);
}
.feature h3 {
  font-size: 25px;
  letter-spacing: -1px;
  font-weight: 500;
  margin: 37px 0 15px;
}
.feature p {
  font-size: 16px;
  line-height: 1.7;
  color: #64616e;
  margin: 0;
}
@media (max-width: 1000px) {
  .feature {
    padding: 27px;
  }
  .features {
    gap: 14px;
  }
}
@media (max-width: 650px) {
  .features-section {
    padding-bottom: 50px;
  }
  .features {
    grid-template-columns: 1fr;
    margin-top: 35px;
  }
  .feature {
    min-height: 0;
    padding: 28px;
    border-radius: 18px;
  }
  .feature h3 {
    margin-top: 25px;
    font-size: 25px;
  }
  .feature p {
    font-size: 16px;
  }
}
</style>
