<template>
  <div
    ref="root"
    class="landing"
  >
    <landing-header
      @open-menu="openDialog('menu')"
      @open-demo="openDialog('demo')"
    />
    <main class="privacy">
      <div class="container">
        <article class="privacy-text">
          <p class="kicker">
            Il tuo dato, spiegato bene.
          </p>
          <h1>Informativa sulla privacy</h1>
          <p class="privacy-sub">
            ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR)
          </p>
          <p class="privacy-date">
            Data di ultima modifica: 09/11/2026
          </p>
          <p>Questa informativa vale per tutti i servizi Hubstra: il sito e il modulo di richiesta demo, la piattaforma web di gestione ordini e consegne, il tracciamento pubblico dell’ordine e l’app mobile <strong>Hubstra Delivery</strong> per iOS e Android.</p>
          <h2>1. Titolare del trattamento</h2>
          <p>Il Titolare del trattamento dei dati personali è Giovanni Colasanto, con sede legale in Via Andrea Doria 15, Molfetta BA 70056, P. IVA IT09007480727, contattabile all’indirizzo email giovanni.colasanto@pec.it.</p>
          <p><strong>Ruoli.</strong> Per i dati dei visitatori del sito e di chi richiede una demo, il Titolare agisce come titolare autonomo. Per i dati inseriti dalle aziende che utilizzano la piattaforma (ordini, destinatari, utenti, corrieri), l’azienda cliente determina finalità e mezzi del trattamento e il Titolare opera come suo Responsabile del trattamento ai sensi dell’art. 28 GDPR; in questo caso le richieste degli interessati possono essere rivolte anche all’azienda cliente.</p>
          <h2>2. Tipologie di dati trattati</h2>
          <p>I servizi trattano le seguenti categorie di dati personali:</p>
          <ul>
            <li>
              <strong>Dati degli utenti registrati (amministratori, clienti, delivery, operatori)</strong>
              <ul>
                <li>Indirizzo email, usato anche come credenziale di accesso</li>
                <li>Password (in forma cifrata, mai conservata in chiaro)</li>
                <li>Identificativo utente e ruolo all’interno della piattaforma</li>
                <li>Appartenenza a gruppi cliente o delivery</li>
                <li>Dati di sessione (token di accesso e di rinnovo, vedi punto 12)</li>
              </ul>
            </li>
            <li>
              <strong>Dati operativi degli utenti delivery</strong>
              <ul>
                <li>Località operativa</li>
                <li>Coordinate geografiche (latitudine e longitudine)</li>
                <li>Associazione a gruppi di consegna, mezzi e pianificazioni</li>
              </ul>
            </li>
            <li>
              <strong>Dati relativi agli ordini</strong>
              <ul>
                <li>Nominativo del destinatario</li>
                <li>Indirizzo di consegna e CAP</li>
                <li>Date di consegna previste e reali</li>
                <li>Stato e tipologia dell’ordine</li>
                <li>Note del cliente e dell’operatore, note di consegna</li>
                <li>Eventuali anomalie o ritardi, con relativa motivazione</li>
                <li>Firma del destinatario e documentazione fotografica</li>
                <li>Identificativi esterni dell’ordine</li>
              </ul>
            </li>
            <li>
              <strong>Dati logistici e di pianificazione</strong>
              <ul>
                <li>Programmazioni giornaliere delle attività</li>
                <li>Fasce orarie operative</li>
                <li>Mezzi di trasporto utilizzati (nome, targa)</li>
                <li>Punti di ritiro e consegna</li>
              </ul>
            </li>
            <li>
              <strong>Dati relativi a servizi e prodotti</strong>
              <ul>
                <li>Tipologia di servizio richiesto</li>
                <li>Prezzo del servizio</li>
                <li>Prodotti associati all’ordine</li>
                <li>Punti di ritiro associati ai prodotti</li>
              </ul>
            </li>
            <li>
              <strong>Dati di organizzazione territoriale</strong>
              <ul>
                <li>Zone geografiche</li>
                <li>Codici territoriali (es. CAP)</li>
                <li>Vincoli operativi per giorno della settimana</li>
              </ul>
            </li>
            <li>
              <strong>Dati delle richieste di demo</strong>
              <ul>
                <li>Nome del referente, ragione sociale, email aziendale e numero di cellulare (necessari)</li>
                <li>Partita IVA, indirizzo aziendale, città, CAP, tipo di attività e messaggio libero (facoltativi). Nel messaggio non vanno inseriti dati relativi alla salute o altre informazioni particolarmente delicate</li>
              </ul>
            </li>
            <li>
              <strong>Dati tecnici e di diagnostica</strong>
              <ul>
                <li>Indirizzo IP, data e ora della richiesta e informazioni sul browser, registrati dal server</li>
                <li>Per l’app mobile: versione dell’app, numero di build, piattaforma (iOS o Android) e, in caso di errore, il messaggio e i dettagli tecnici dell’errore (rapporto di errore)</li>
                <li>Registri tecnici delle richieste inviate alla piattaforma (data e ora, utente, operazione eseguita e dati trasmessi, comprese le coordinate inviate all’attivazione della posizione), consultabili solo dal super amministratore della piattaforma</li>
              </ul>
            </li>
          </ul>
          <h2>3. App mobile Hubstra Delivery e geolocalizzazione degli utenti delivery</h2>
          <p>Gli utenti delivery (corrieri) utilizzano l’app mobile <strong>Hubstra Delivery</strong> per gestire il giro consegne. Per accedervi servono le credenziali (email e password) create dall’amministratore dell’attività: nell’app non è possibile registrarsi autonomamente. Oltre ai dati indicati al punto 2, l’app tratta i seguenti dati raccolti direttamente dal dispositivo, previo consenso ai relativi permessi di sistema:</p>
          <ul>
            <li><strong>Posizione geografica precisa</strong> (latitudine e longitudine) del dispositivo in uso</li>
            <li><strong>Fotografie</strong> acquisite tramite la fotocamera o selezionate dalla galleria, a documentazione della consegna o del ritiro (bolle comprese)</li>
            <li><strong>Firma del destinatario</strong>, disegnata sullo schermo del dispositivo e salvata come immagine, e note di consegna</li>
            <li><strong>Rapporti di errore</strong> inviati al server quando l’app incontra un errore imprevisto, con le informazioni tecniche indicate al punto 2</li>
          </ul>
          <p>Le consegne compilate che non è stato possibile inviare (per assenza di rete o errore del server) restano salvate sul dispositivo e sono reinviate appena possibile; sono associate al corriere che le ha compilate. Le credenziali di sessione sono conservate nell’archivio protetto del dispositivo. L’app non contiene strumenti di analisi, pubblicità o tracciamento, non utilizza SDK di terze parti per tali finalità e non condivide dati con reti pubblicitarie.</p>
          <p><strong>Quando viene rilevata la posizione.</strong> La rilevazione è avviata dall’utente delivery con il pulsante “Attiva” del banner del borderò e termina quando il borderò viene completato. Con più corrieri sullo stesso borderò la posizione è condivisa da uno solo alla volta, che può passare il controllo a un collega. All’interno di tale intervallo la posizione è rilevata in modo continuativo e trasmessa al gestionale, <strong>anche quando l’app è in secondo piano o lo schermo è bloccato</strong>. Al di fuori di tale intervallo l’app non rileva né trasmette alcun dato di posizione. L’attivazione della posizione è necessaria per lavorare sul borderò: senza di essa le operazioni di ritiro, attività e chiusura ordine non sono disponibili.</p>
          <p><strong>Trasparenza della rilevazione.</strong> Per tutta la durata della rilevazione il dispositivo segnala che la localizzazione è attiva: su Android tramite una notifica persistente, su iOS tramite l’indicatore di sistema. L’utente delivery può interrompere la rilevazione in qualsiasi momento revocando i permessi di posizione, fotocamera e galleria dalle impostazioni del dispositivo; in tal caso le funzioni che dipendono da tali permessi non saranno disponibili.</p>
          <p><strong>Finalità.</strong> Coordinamento e ottimizzazione dei giri di consegna, aggiornamento dello stato degli ordini, tracciabilità delle attività di consegna, informazione del destinatario sull’avanzamento della consegna e sicurezza dell’operatore durante il servizio.</p>
          <p><strong>Base giuridica.</strong> Esecuzione del rapporto contrattuale (art. 6.1.b GDPR) e legittimo interesse del Titolare e dell’azienda cliente all’organizzazione e alla sicurezza del servizio logistico (art. 6.1.f GDPR). Il trattamento è effettuato nel rispetto dell’art. 4 della L. 300/1970 (Statuto dei lavoratori): l’azienda cliente, in qualità di datore di lavoro e titolare del trattamento dei dati dei propri collaboratori, è responsabile di ottenere l’accordo sindacale o l’autorizzazione dell’Ispettorato Territoriale del Lavoro, ove previsti, prima di attivare la rilevazione della posizione dei propri corrieri.</p>
          <p><strong>Conservazione dei dati di posizione.</strong> Per ogni corriere la piattaforma conserva soltanto l’ultima posizione ricevuta, che viene sostituita a ogni nuovo invio e <strong>cancellata quando il borderò viene completato</strong> e, in ogni caso, entro 24 ore dall’ultimo aggiornamento. Non viene registrato lo storico degli spostamenti. Restano registrati, per 12 mesi, la data e l’ora in cui la posizione è stata attivata, passata a un altro corriere e chiusa per ciascun borderò, senza coordinate. I registri tecnici indicati al punto 2 sono conservati per 90 giorni.</p>
          <p><strong>Chi vede la posizione.</strong> Durante la consegna di un ordine la posizione più recente del corriere è visibile al destinatario tramite il link di tracciamento ricevuto via SMS, valido fino a 7 giorni dopo la data di consegna prevista, e agli utenti dell’azienda cliente autorizzati a consultare l’ordine. Il link non mostra il numero di telefono del destinatario.</p>
          <p><strong>Limiti di utilizzo.</strong> I dati di geolocalizzazione non sono utilizzati per finalità di controllo a distanza dell’attività lavorativa del singolo, né per valutazioni automatizzate o processi decisionali automatizzati sui lavoratori. L’accesso ai dati è limitato al personale autorizzato per le sole finalità organizzative sopra indicate.</p>
          <h2>4. Finalità del trattamento</h2>
          <p>I dati personali sono trattati per le seguenti finalità:</p>
          <ul>
            <li>Gestione e organizzazione degli ordini di elettrodomestici e altri articoli</li>
            <li>Pianificazione e coordinamento delle attività di consegna</li>
            <li>Assegnazione degli ordini agli utenti delivery</li>
            <li>Fornitura del servizio di tracciamento dell’ordine ai clienti finali tramite link dedicato</li>
            <li>Comunicazioni operative relative alla consegna (es. ritardi, tentativi di consegna)</li>
            <li>Autenticazione degli utenti e gestione delle sessioni</li>
            <li>Rispondere alle richieste di demo, ricontattare il richiedente e svolgere le attività precontrattuali richieste</li>
            <li>Sicurezza, individuazione e correzione degli errori e corretto funzionamento della piattaforma e dell’app</li>
            <li>Adempimento di obblighi legali e contrattuali</li>
          </ul>
          <p>La richiesta di demo non comporta iscrizione a newsletter né invio di comunicazioni promozionali non richieste. Non vengono adottate decisioni automatizzate né attività di profilazione.</p>
          <h2>5. Base giuridica del trattamento</h2>
          <p>Il trattamento dei dati si basa sulle seguenti basi giuridiche:</p>
          <ul>
            <li>Esecuzione di un contratto o di misure precontrattuali, comprese quelle richieste dall’interessato con il modulo demo (art. 6.1.b GDPR)</li>
            <li>Adempimento di obblighi legali (art. 6.1.c GDPR)</li>
            <li>Legittimo interesse alla gestione logistica e organizzativa del servizio, alla sicurezza della piattaforma e alla gestione delle richieste professionali ricevute (art. 6.1.f GDPR)</li>
            <li>Consenso dell’interessato, ove richiesto, per esempio per i permessi di posizione, fotocamera e galleria del dispositivo (art. 6.1.a GDPR)</li>
          </ul>
          <p>Il conferimento dei dati contrassegnati come necessari è indispensabile per usare il servizio o completare il modulo di richiesta; in mancanza non è possibile procedere.</p>
          <h2>6. Modalità di trattamento e sicurezza</h2>
          <p>Il trattamento dei dati avviene mediante strumenti informatici e telematici, nel rispetto dei principi di liceità, correttezza, trasparenza, minimizzazione dei dati e sicurezza. Sono adottate misure tecniche e organizzative adeguate per prevenire accessi non autorizzati, perdita o divulgazione dei dati personali, tra cui comunicazioni cifrate (HTTPS), conservazione cifrata delle password, sessioni con scadenza e rinnovo controllato, accesso ai dati limitato per ruolo e per azienda.</p>
          <h2>7. Destinatari dei dati</h2>
          <p>I dati personali possono essere comunicati a:</p>
          <ul>
            <li>Aziende clienti e fornitori che utilizzano la piattaforma, limitatamente ai dati dei propri ordini e dei propri corrieri</li>
            <li>Utenti delivery incaricati della consegna</li>
            <li>Fornitori di servizi IT, hosting e posta elettronica, necessari al funzionamento dei servizi</li>
            <li>Fornitori di servizi tecnici di cui la piattaforma si avvale: Resend (invio delle email), Vonage (invio degli SMS ai destinatari delle consegne) e Telegram (avvisi tecnici interni su errori e controlli del servizio) e Cloudflare (distribuzione delle pagine web e rete di consegna dei contenuti). Google (mappe e suggerimento degli indirizzi nei moduli degli operatori). Per una parte delle ricerche di indirizzi la piattaforma usa anche un servizio gestito direttamente dal Titolare</li>
            <li>Consulenti tecnici e legali</li>
            <li>Autorità competenti, ove richiesto dalla legge</li>
          </ul>
          <p>I soggetti terzi operano come Responsabili del trattamento o Titolari autonomi, ove applicabile. I dati non sono diffusi né ceduti a fini pubblicitari o di marketing. I server applicativi e il database sono gestiti direttamente dal Titolare presso la propria sede in Italia. Le pagine web dei siti e della piattaforma sono distribuite tramite Cloudflare Pages (Cloudflare, Inc.), che può trattare indirizzi IP e dati tecnici di navigazione anche fuori dall’Unione Europea. L’invio delle email è affidato a Resend.</p>
          <h2>8. Trasferimento dei dati extra UE</h2>
          <p>Alcuni dei fornitori indicati al punto 7, ad esempio Resend, Telegram, Google e Cloudflare, possono trattare dati in Paesi al di fuori dell’Unione Europea. Qualora i dati personali siano trasferiti verso tali Paesi, il trasferimento avverrà nel rispetto degli artt. 44 e seguenti del GDPR, mediante l’adozione di garanzie adeguate, quali Clausole Contrattuali Standard.</p>
          <h2>9. Periodo di conservazione</h2>
          <p>I dati personali sono conservati per il tempo strettamente necessario al perseguimento delle finalità indicate e, successivamente, per il periodo previsto dalla normativa vigente in materia civilistica e fiscale. In particolare:</p>
          <ul>
            <li>dati di posizione: vedi punto 3</li>
            <li>richieste di demo: salvate nell’archivio della piattaforma e inviate via email ai referenti commerciali, per il tempo necessario a gestire la richiesta e l’eventuale seguito precontrattuale e comunque non oltre 12 mesi, salvo che il richiedente diventi cliente. Possono essere cancellate prima su richiesta dell’interessato</li>
            <li>registri tecnici delle richieste: 90 giorni</li>
            <li>rapporti di errore dell’app e avvisi tecnici interni: 30 giorni</li>
            <li>dati dell’account: fino alla disattivazione dell’utente da parte dell’azienda cliente o dell’amministratore</li>
          </ul>
          <h2>10. Diritti degli interessati</h2>
          <p>Gli interessati possono esercitare in qualsiasi momento i diritti previsti dagli artt. 15–22 del GDPR, tra cui accesso ai dati, rettifica o aggiornamento, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione al trattamento fondato sul legittimo interesse. Le richieste possono essere inviate al Titolare ai recapiti indicati al punto 1. Gli utenti delivery possono rivolgersi anche all’amministratore dell’azienda per cui lavorano.</p>
          <h2>11. Reclamo all’Autorità di controllo</h2>
          <p>
            Gli interessati che ritengano che il trattamento dei dati personali avvenga in violazione della normativa vigente hanno il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (<a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noopener noreferrer"
            >garanteprivacy.it</a>) o ad altra autorità di controllo competente ai sensi del GDPR.
          </p>
          <h2>12. Cookie e strumenti di archiviazione</h2>
          <p>La piattaforma utilizza esclusivamente cookie tecnici e strumenti di archiviazione necessari al suo funzionamento. Non sono utilizzati cookie di profilazione, cookie analitici o cookie di terze parti, e non viene effettuato alcun tracciamento della navigazione. Per questo motivo, ai sensi dell’art. 122, comma 1, del D.Lgs. 196/2003, non è richiesto il consenso preventivo dell’utente e non viene mostrato alcun banner. Il sito pubblico e il modulo di richiesta demo non impostano cookie e non usano localStorage o sessionStorage: i dati compilati sono trasmessi solo all’invio della richiesta.</p>
          <ul>
            <li>
              <strong>Cookie tecnici (di sessione)</strong>
              <ul>
                <li><strong>Nome:</strong> refresh_token</li>
                <li><strong>Titolare:</strong> prima parte (dominio della piattaforma)</li>
                <li><strong>Finalità:</strong> mantenere l’utente autenticato tra una visita e l’altra, consentendo di rinnovare le credenziali di accesso senza richiedere nuovamente email e password</li>
                <li><strong>Durata:</strong> 30 giorni, rinnovati a ogni utilizzo; il cookie viene eliminato al logout</li>
                <li><strong>Caratteristiche:</strong> non accessibile da codice JavaScript (HttpOnly), trasmesso solo su connessione cifrata (Secure) e non inviato a siti terzi (SameSite)</li>
              </ul>
            </li>
            <li>
              <strong>Archiviazione locale nel browser (localStorage)</strong>
              <ul>
                <li><strong>Chiave:</strong> user</li>
                <li><strong>Finalità:</strong> conservare le informazioni necessarie a ricostruire l’interfaccia dopo un aggiornamento della pagina</li>
                <li><strong>Dati conservati:</strong> ruolo dell’utente, identificativo dell’utente e azienda selezionata</li>
                <li><strong>Durata:</strong> fino al logout, che ne determina la cancellazione, o fino alla rimozione manuale dei dati del browser</li>
              </ul>
            </li>
          </ul>
          <p>Le credenziali di accesso vere e proprie non vengono mai salvate nel browser: sono conservate nella sola memoria volatile della pagina e vengono perse alla sua chiusura.</p>
          <p>L’utente può in qualsiasi momento bloccare o cancellare i cookie tramite le impostazioni del proprio browser. Trattandosi di cookie tecnici indispensabili, il loro blocco impedisce l’accesso alla piattaforma e il mantenimento della sessione di lavoro.</p>
          <h2>13. Modifiche alla presente informativa</h2>
          <p>Il Titolare si riserva il diritto di modificare la presente Informativa sulla Privacy in qualsiasi momento. Le modifiche saranno pubblicate sulla piattaforma, all’indirizzo /privacy, e, ove necessario, comunicate agli utenti tramite i canali appropriati.</p>
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
  document.title = 'Informativa sulla privacy — HUBSTRA';
  document.documentElement.classList.add('landing-page');
});

onBeforeUnmount(() => {
  document.title = previousTitle;
  document.documentElement.classList.remove('landing-page');
  document.body.classList.remove('landing-lock');
});
</script>

<style scoped>
.privacy {
  padding: 150px 0 110px;
}
.privacy-text {
  max-width: 820px;
  margin-inline: auto;
}
.privacy-text h1 {
  font-size: clamp(40px,4.7vw,65px);
  line-height: 1.08;
  letter-spacing: -3px;
  font-weight: 600;
  margin: 0 0 22px;
}
.privacy-sub {
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  margin: 0 0 8px;
}
.privacy-date {
  font-size: 14px;
  color: var(--muted);
  margin: 0 0 12px;
}
.privacy-text h2 {
  font-size: 26px;
  font-weight: 500;
  letter-spacing: -1px;
  line-height: 1.25;
  margin: 56px 0 14px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.privacy-text p,
.privacy-text li {
  font-size: 16px;
  line-height: 1.75;
  color: #625b70;
}
.privacy-text p {
  margin: 0 0 14px;
}
.privacy-text strong {
  color: var(--ink);
  font-weight: 600;
}
.privacy-text ul {
  margin: 0 0 14px;
  padding-left: 22px;
}
.privacy-text li {
  margin-bottom: 8px;
}
.privacy-text li > ul {
  margin: 8px 0 0;
}
.privacy-text a {
  color: var(--blue);
  text-decoration: underline;
}
@media (max-width: 650px) {
  .privacy {
    padding: 120px 0 80px;
  }
  .privacy-text h1 {
    font-size: 39px;
    letter-spacing: -2px;
  }
  .privacy-sub {
    font-size: 16px;
  }
  .privacy-text h2 {
    font-size: 22px;
    margin-top: 44px;
  }
  .privacy-text p,
  .privacy-text li {
    font-size: 15px;
  }
}
</style>
