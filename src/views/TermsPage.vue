<template>
  <div
    ref="root"
    class="landing"
  >
    <landing-header
      @open-menu="openDialog('menu')"
      @open-demo="openDialog('demo')"
    />
    <main class="terms">
      <div class="container">
        <article class="terms-text">
          <p class="kicker">
            Regole chiare, in poche pagine.
          </p>
          <h1>Termini e condizioni d’uso</h1>
          <p class="terms-sub">
            Servizio Hubstra: piattaforma web e app Hubstra Delivery
          </p>
          <p class="terms-date">
            Data di ultima modifica: 14/11/2026
          </p>
          <h2>1. Chi siamo e a chi si rivolge il servizio</h2>
          <p>Il servizio Hubstra è fornito da <strong>Giovanni Colasanto</strong>, con sede in Via Andrea Doria 15, Molfetta BA 70056, P. IVA IT09007480727 (il “Fornitore”). È destinato ad aziende e professionisti (il “Cliente”) e non ai consumatori. Contatti: <a href="mailto:giovanni.colasanto@fastsite.it">giovanni.colasanto@fastsite.it</a>, PEC giovanni.colasanto@pec.it.</p>
          <h2>2. Il servizio</h2>
          <p>Hubstra è una piattaforma per la gestione di ordini, consegne e borderò, con il tracciamento della consegna per il destinatario e l’app <strong>Hubstra Delivery</strong> per i corrieri del Cliente, su iPhone e Android. Alcune funzioni, come il modulo RAEE, sono disponibili solo se attivate per il Cliente.</p>
          <h2>3. Accordo e accettazione</h2>
          <p>Questi termini regolano il contratto tra il Fornitore e il Cliente. Si accettano con l’iscrizione al servizio, con la firma dell’offerta o con l’uso della piattaforma. Corrispettivo, durata, rinnovo e recesso sono quelli indicati nell’offerta o nel piano scelto. I corrieri e gli altri utenti usano il servizio per conto del Cliente e non sono parte del contratto.</p>
          <h2>4. Account e accesso</h2>
          <ul>
            <li>Gli account sono creati e gestiti dall’amministratore del Cliente: nell’app non è possibile registrarsi da soli.</li>
            <li>Le credenziali sono personali e non vanno condivise. Il Cliente è responsabile dell’uso che ne fanno i suoi utenti.</li>
            <li>Ogni accesso non autorizzato va segnalato subito al Fornitore.</li>
          </ul>
          <h2>5. Uso consentito e responsabilità del Cliente</h2>
          <ul>
            <li>Il Cliente usa il servizio nel rispetto della legge e inserisce solo dati che ha il diritto di trattare. Resta titolare dei propri dati.</li>
            <li>Il Cliente non usa il servizio per scopi illeciti e non tenta di accedere ai dati di altri clienti o di compromettere la piattaforma.</li>
            <li><strong>Posizione dei corrieri.</strong> Il Cliente, in quanto datore di lavoro o committente dei corrieri, è l’unico responsabile di ottenere l’accordo sindacale o l’autorizzazione dell’Ispettorato Territoriale del Lavoro, ove previsti (art. 4 L. 300/1970), di informare i corrieri e di effettuare la valutazione d’impatto, se dovuta. Il Fornitore non usa la posizione per valutare i corrieri.</li>
            <li>Il Cliente informa i destinatari delle consegne che riceveranno un link di tracciamento e che vedranno la posizione del corriere durante la consegna.</li>
          </ul>
          <h2>6. Disponibilità e assistenza</h2>
          <p>Il Fornitore offre il servizio con la dovuta diligenza, ma non garantisce l’assenza di interruzioni. Possono esserci manutenzioni programmate e disservizi dovuti a terzi, come reti o fornitori di servizi. L’assistenza è offerta via email, ai recapiti della pagina <a href="/assistenza">Assistenza</a>, salvo diverso accordo scritto.</p>
          <h2>7. Sospensione</h2>
          <p>Il Fornitore può sospendere il servizio in caso di mancato pagamento, uso illecito o rischio per la sicurezza, con preavviso quando possibile.</p>
          <h2>8. Proprietà intellettuale</h2>
          <p>Il software, i marchi e i contenuti della piattaforma restano del Fornitore. Al Cliente è concesso un diritto d’uso non esclusivo e non trasferibile per la durata del contratto. I dati inseriti dal Cliente restano del Cliente.</p>
          <h2>9. Responsabilità</h2>
          <p>Il Fornitore non risponde dei danni indiretti, del mancato guadagno o delle perdite dovute a interruzioni di servizi di terzi. Salvo dolo o colpa grave e nei limiti consentiti dalla legge, la responsabilità complessiva del Fornitore verso il Cliente non supera i corrispettivi pagati nei dodici mesi precedenti.</p>
          <h2>10. Dati personali</h2>
          <p>Il trattamento dei dati è descritto nell’<a href="/privacy">informativa sulla privacy</a>. Per i dati che il Cliente inserisce nella piattaforma il Fornitore è responsabile del trattamento e il Cliente è titolare: vale l’Allegato A qui sotto.</p>
          <h2>11. Modifiche ai termini</h2>
          <p>Il Fornitore può aggiornare questi termini. La versione in vigore è quella pubblicata in questa pagina, con la data di ultima modifica. Le modifiche sostanziali sono comunicate al Cliente con ragionevole anticipo.</p>
          <h2>12. Legge applicabile e foro</h2>
          <p>Si applica la legge italiana. Per ogni controversia è competente il foro del luogo in cui ha sede il Fornitore, salvo diversa norma inderogabile.</p>
          <h2>Allegato A – Trattamento dei dati personali (art. 28 GDPR)</h2>
          <p>Questo allegato è la nomina del Fornitore a responsabile del trattamento da parte del Cliente e fa parte del contratto.</p>
          <h3>A1. Ruoli, oggetto e durata</h3>
          <p>Il Cliente è titolare del trattamento dei dati che inserisce o raccoglie con la piattaforma; il Fornitore li tratta per suo conto, per fornire il servizio e per la durata del contratto.</p>
          <h3>A2. Dati e interessati</h3>
          <ul>
            <li><strong>Interessati:</strong> utenti e corrieri del Cliente, destinatari delle consegne.</li>
            <li><strong>Dati:</strong> email e identificativo degli utenti; nome, indirizzo e telefono dei destinatari; dati e note degli ordini; fotografie e firma di consegna; posizione dei corrieri durante la consegna; dati tecnici di accesso.</li>
          </ul>
          <h3>A3. Obblighi del Fornitore</h3>
          <ul>
            <li>Tratta i dati solo su istruzione documentata del Cliente, che sono questi termini e le funzioni della piattaforma, e informa il Cliente se ritiene che un’istruzione violi la legge.</li>
            <li>Garantisce che le persone autorizzate al trattamento siano vincolate alla riservatezza.</li>
            <li>Adotta misure di sicurezza adeguate (art. 32): comunicazioni cifrate (HTTPS), password conservate in forma cifrata, accesso ai dati limitato per ruolo e per azienda, sessioni con scadenza, registri tecnici degli accessi e copie di sicurezza periodiche su un server separato situato in Italia.</li>
            <li>Assiste il Cliente nel rispondere alle richieste degli interessati e negli obblighi degli artt. 32-36 GDPR, e mette a disposizione le informazioni necessarie a dimostrare il rispetto di questo allegato.</li>
          </ul>
          <h3>A4. Fornitori (sub-responsabili)</h3>
          <p>Il Cliente autorizza in via generale il Fornitore a usare i seguenti fornitori:</p>
          <ul>
            <li>Cloudflare (distribuzione delle pagine web e rete di consegna dei contenuti)</li>
            <li>Resend (invio delle email del servizio)</li>
            <li>Vonage (invio degli SMS ai destinatari delle consegne)</li>
            <li>Telegram (avvisi tecnici interni su errori e controlli del servizio)</li>
            <li>Google (mappe e suggerimento degli indirizzi nei moduli per gli operatori)</li>
          </ul>
          <p>Il Fornitore ha con ciascuno un accordo sul trattamento dei dati e risponde del loro operato. Informa il Cliente di ogni cambiamento di fornitore, che può opporsi per motivi legittimi.</p>
          <h3>A5. Trasferimenti fuori dall’Unione Europea</h3>
          <p>Alcuni fornitori, ad esempio Cloudflare, Resend, Google e Telegram, possono trattare dati fuori dall’UE. Il Fornitore si assicura che il trasferimento avvenga con garanzie adeguate, come le clausole contrattuali standard.</p>
          <h3>A6. Violazione dei dati</h3>
          <p>Il Fornitore informa il Cliente senza ingiustificato ritardo dopo essere venuto a conoscenza di una violazione dei dati personali, con le informazioni disponibili per la notifica all’autorità di controllo.</p>
          <h3>A7. Fine del contratto</h3>
          <p>Alla cessazione del contratto il Fornitore, a scelta del Cliente, restituisce o cancella i dati entro un termine ragionevole. I dati possono restare per un periodo limitato nelle copie di sicurezza e vengono poi eliminati con la loro rotazione. I periodi di conservazione durante il contratto sono scelti dal Cliente, titolare dei dati.</p>
          <h3>A8. Obblighi del Cliente come titolare</h3>
          <p>Il Cliente è responsabile della base giuridica del trattamento, dell’informativa ai propri collaboratori e ai destinatari delle consegne, della correttezza dei dati inseriti e degli adempimenti sulla posizione dei corrieri indicati al punto 5.</p>
        </article>
      </div>
    </main>
    <landing-footer @open-policy="openDialog('cookie')" />
    <landing-menu-dialog
      v-model="dialogs.menu"
      @open-demo="openDialog('demo')"
    />
    <landing-demo-dialog v-model="dialogs.demo" />
    <landing-cookie-dialog v-model="dialogs.cookie" />
  </div>
</template>

<script setup>
import '@/styles/landing.css';
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue';
import LandingCookieDialog from '@/components/landing/LandingCookieDialog.vue';
import LandingDemoDialog from '@/components/landing/LandingDemoDialog.vue';
import LandingFooter from '@/components/landing/LandingFooter.vue';
import LandingHeader from '@/components/landing/LandingHeader.vue';
import LandingMenuDialog from '@/components/landing/LandingMenuDialog.vue';

const previousTitle = document.title;

const dialogs = reactive({ menu: false, demo: false, cookie: false });
const anyDialogOpen = computed(() => Object.values(dialogs).some(Boolean));

// Menu e demo si escludono a vicenda; l'informativa cookie si apre sopra a quello che c'è.
const openDialog = (name) => {
  if (name !== 'cookie')
    dialogs.menu = dialogs.demo = false;
  dialogs[name] = true;
};

watch(anyDialogOpen, (open) => document.body.classList.toggle('landing-lock', open));

onMounted(() => {
  document.title = 'Termini e condizioni — HUBSTRA';
  document.documentElement.classList.add('landing-page');
});

onBeforeUnmount(() => {
  document.title = previousTitle;
  document.documentElement.classList.remove('landing-page');
  document.body.classList.remove('landing-lock');
});
</script>

<style scoped>
.terms {
  padding: 150px 0 110px;
}
.terms-text {
  max-width: 820px;
  margin-inline: auto;
}
.terms-date {
  font-size: 14px;
  color: var(--muted);
  margin: 0 0 12px;
}
.terms-text h1 {
  font-size: clamp(40px,4.7vw,65px);
  line-height: 1.08;
  letter-spacing: -3px;
  font-weight: 600;
  margin: 0 0 22px;
}
.terms-sub {
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 8px;
}
.terms-text h2 {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -1px;
  line-height: 1.25;
  margin: 56px 0 14px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.terms-text h3 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -.5px;
  margin: 30px 0 10px;
}
.terms-text p,
.terms-text li {
  font-size: 16px;
  line-height: 1.75;
  color: #625b70;
}
.terms-text p {
  margin: 0 0 14px;
}
.terms-text strong {
  color: var(--ink);
  font-weight: 600;
}
.terms-text ul {
  margin: 0 0 14px;
  padding-left: 22px;
}
.terms-text li {
  margin-bottom: 8px;
}
.terms-text a {
  color: var(--blue);
  text-decoration: underline;
}
@media (max-width: 650px) {
  .terms {
    padding: 120px 0 80px;
  }
  .terms-text h1 {
    font-size: 39px;
    letter-spacing: -2px;
  }
  .terms-sub {
    font-size: 16px;
  }
  .terms-text h2 {
    font-size: 22px;
    margin-top: 44px;
  }
  .terms-text h3 {
    font-size: 17px;
  }
  .terms-text p,
  .terms-text li {
    font-size: 15px;
  }
}
</style>
