<template>
  <section
    id="vantaggi"
    class="blue-panel container reveal"
  >
    <p class="kicker">
      Più ordine nel lavoro di ogni giorno.
    </p>
    <div class="panel-grid">
      <div>
        <h2>Quando le informazioni<br>sono sparse.</h2>
        <ul>
          <li>Appuntamenti da concordare dopo la vendita.</li>
          <li>Ordini da ricopiare tra file e documenti.</li>
          <li>Anomalie da comunicare una per una.</li>
          <li>Prestazioni da valorizzare a fine mese.</li>
        </ul>
      </div>
      <div class="solution">
        <h2>Con HUBSTRA,<br>ogni fase ha il suo posto.</h2>
        <p>Dalle disponibilità alla vendita fino alle proforma, gestisci le attività nello stesso sistema. Importi gli ordini, assegni le consegne, raccogli gli esiti e segui i RAEE fino allo smaltimento.</p>
        <a
          class="button light-button"
          href="#piattaforma"
        >Scopri le funzioni</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blue-panel {
  background: var(--blue);
  color: white;
  border-radius: var(--radius);
  padding: 85px 80px;
  margin: 45px auto 100px;
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(45deg,transparent 49.5%,#ffffff06 50%,transparent 50.5%),linear-gradient(-45deg,transparent 49.5%,#ffffff06 50%,transparent 50.5%);
  background-size: 100px 100px;
}
.blue-panel .kicker {
  color: #c6bcff;
}
.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 85px;
}
.blue-panel h2 {
  font-size: 48px;
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -2px;
  margin: 0 0 30px;
}
.blue-panel ul {
  padding: 0;
  list-style: none;
  margin: 0;
}
.blue-panel li {
  color: #d4ccff;
  font-size: 17px;
  line-height: 1.5;
  padding: 13px 0;
  border-bottom: 1px solid #ffffff26;
}
.blue-panel .solution {
  padding-left: 40px;
  border-left: 1px solid #ffffff38;
}
.solution p {
  font-size: 18px;
  color: #d4ccff;
  line-height: 1.7;
  margin: 0 0 27px;
}
.button.light-button {
  background: white;
  color: var(--blue);
}
.button.light-button:hover {
  background: #eeeaff;
}
@media (max-width: 1000px) {
  .blue-panel {
    padding: 60px 45px;
  }
  .panel-grid {
    gap: 40px;
  }
  .blue-panel h2 {
    font-size: 40px;
  }
  .blue-panel .solution {
    padding-left: 30px;
  }
}
@media (max-width: 650px) {
  .blue-panel {
    padding: 42px 27px;
    border-radius: 20px;
    margin: 25px auto 70px;
  }
  .panel-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  .blue-panel h2 {
    font-size: 38px;
  }
  .blue-panel .solution {
    border-left: 0;
    border-top: 1px solid #ffffff38;
    padding-left: 0;
    padding-top: 32px;
  }
  .blue-panel li {
    font-size: 15px;
  }
  .solution p {
    font-size: 16px;
  }
}
</style>
