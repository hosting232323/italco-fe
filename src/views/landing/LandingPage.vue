<template>
  <div
    ref="root"
    class="landing"
  >
    <header class="header">
      <div class="container nav">
        <a
          href="#inizio"
          class="brand"
          aria-label="HUBSTRA, home"
        >HUBSTRA</a>
        <div class="nav-right">
          <button
            id="open-menu"
            class="menu-button"
            aria-haspopup="dialog"
            aria-controls="menu"
          >
            <span
              class="hamb"
              aria-hidden="true"
            >
              <i />
              <i />
            </span>Menu
          </button>
          <router-link
            class="button outline"
            to="/login"
          >
            Accedi
          </router-link>
          <button
            class="button"
            data-demo
          >
            Richiedi una demo
          </button>
        </div>
      </div>
    </header>
    <main id="inizio">
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
            data-demo
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
      <section
        class="gallery-section"
        aria-label="Esplora le funzioni di HUBSTRA"
      >
        <div
          id="stage"
          class="stage"
          tabindex="0"
          role="region"
          aria-roledescription="carosello"
          aria-label="Anteprime della piattaforma, usa i pulsanti o le frecce della tastiera"
        >
          <article
            class="screen product-screen"
            data-pos="0"
            role="group"
            aria-label="1 di 4: Dashboard e indicatori"
          >
            <img
              src="/landing/dashboard-demo.png"
              alt="Schermata Dashboard e indicatori di HUBSTRA con dati dimostrativi"
              width="1536"
              height="1024"
              decoding="async"
            >
            <div class="product-screen-caption">
              <span>Dashboard e indicatori</span>
              <button
                type="button"
                class="zoom-screen"
                data-zoom="0"
                aria-label="Ingrandisci Dashboard e indicatori"
              >
                Ingrandisci
              </button>
            </div>
          </article>
          <article
            class="screen product-screen"
            data-pos="1"
            role="group"
            aria-label="2 di 4: Gestione RAEE"
            aria-hidden="true"
            inert
          >
            <img
              src="/landing/raee-demo.png"
              alt="Schermata Gestione RAEE di HUBSTRA con dati dimostrativi"
              width="1536"
              height="1024"
              decoding="async"
            >
            <div class="product-screen-caption">
              <span>Gestione RAEE</span>
              <button
                type="button"
                class="zoom-screen"
                data-zoom="1"
                aria-label="Ingrandisci Gestione RAEE"
              >
                Ingrandisci
              </button>
            </div>
          </article>
          <article
            class="screen product-screen"
            data-pos="2"
            role="group"
            aria-label="3 di 4: Copertura corrieri"
            aria-hidden="true"
            inert
          >
            <img
              src="/landing/copertura-corrieri-demo.png"
              alt="Schermata Copertura corrieri di HUBSTRA con dati dimostrativi"
              width="1536"
              height="1024"
              decoding="async"
            >
            <div class="product-screen-caption">
              <span>Copertura corrieri</span>
              <button
                type="button"
                class="zoom-screen"
                data-zoom="2"
                aria-label="Ingrandisci Copertura corrieri"
              >
                Ingrandisci
              </button>
            </div>
          </article>
          <article
            class="screen product-screen"
            data-pos="-1"
            role="group"
            aria-label="4 di 4: Gestione ordini"
            aria-hidden="true"
            inert
          >
            <img
              src="/landing/ordini-demo.png"
              alt="Schermata Gestione ordini di HUBSTRA con dati dimostrativi"
              width="1536"
              height="1024"
              decoding="async"
            >
            <div class="product-screen-caption">
              <span>Gestione ordini</span>
              <button
                type="button"
                class="zoom-screen"
                data-zoom="3"
                aria-label="Ingrandisci Gestione ordini"
              >
                Ingrandisci
              </button>
            </div>
          </article>
        </div>
        <div class="gallery-bottom">
          <button
            id="previous"
            class="gallery-control"
            aria-label="Anteprima precedente"
          >
            ‹
          </button>
          <div
            class="dots"
            aria-label="Seleziona anteprima"
          >
            <button
              aria-label="Dashboard e indicatori"
              aria-pressed="true"
              data-slide="0"
            />
            <button
              aria-label="Gestione RAEE"
              aria-pressed="false"
              data-slide="1"
            />
            <button
              aria-label="Copertura corrieri"
              aria-pressed="false"
              data-slide="2"
            />
            <button
              aria-label="Gestione ordini"
              aria-pressed="false"
              data-slide="3"
            />
          </div>
          <button
            id="next"
            class="gallery-control"
            aria-label="Anteprima successiva"
          >
            ›
          </button>
        </div>
        <p
          id="gallery-caption"
          class="gallery-caption"
          aria-live="polite"
        >
          Dashboard: ordini, consegne e indicatori · Dati dimostrativi
        </p>
      </section>
      <div class="container partners reveal">
        <p>Una piattaforma per chi vende,<br>chi organizza e chi consegna.</p>
        <div>
          <span>Punto vendita</span>
          <span>Ufficio</span>
          <span>Squadre</span>
        </div>
      </div>
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
          <article class="feature reveal">
            <span class="num">01 / APPUNTAMENTI</span>
            <h3>Data e fascia, già alla vendita.</h3>
            <p>Il punto vendita consulta le disponibilità e comunica al consumatore data e fascia di consegna mentre acquista. L’appuntamento si basa sulla tua pianificazione operativa.</p>
          </article>
          <article class="feature reveal">
            <span class="num">02 / IMPORT ED EXPORT</span>
            <h3>Dai file agli ordini da gestire.</h3>
            <p>Importi gli ordini da Excel e PDF, senza doverli inserire tutti singolarmente. Esporti i dati in Excel per elaborarli o condividerli.</p>
          </article>
          <article class="feature reveal">
            <span class="num">03 / PIANIFICAZIONE</span>
            <h3>Ogni consegna, alla sua squadra.</h3>
            <p>Definisci zone e fasce operative e assegni le consegne agli equipaggi. Le disponibilità pianificate diventano il riferimento per gli appuntamenti alla vendita.</p>
          </article>
          <article class="feature reveal">
            <span class="num">04 / BORDERÒ PDF</span>
            <h3>Le attività assegnate diventano un borderò.</h3>
            <p>HUBSTRA genera automaticamente i borderò con le consegne della squadra. Hai i documenti in PDF per accompagnare la fase di consegna.</p>
          </article>
          <article class="feature reveal">
            <span class="num">05 / SMS ED EMAIL</span>
            <h3>Le comunicazioni partono dal gestionale.</h3>
            <p>Gestisci gli SMS automatici al consumatore. Anomalie e consegne da riprogrammare vengono comunicate via email in tempo reale all’ufficio e ai tuoi committenti.</p>
          </article>
          <article class="feature reveal">
            <span class="num">06 / FOTO E FIRMA</span>
            <h3>La consegna resta documentata.</h3>
            <p>Raccogli le foto in fase di consegna e la firma grafica del cliente. Le prove sono associate all’intervento, insieme al suo esito.</p>
          </article>
          <article class="feature reveal">
            <span class="num">07 / GESTIONE RAEE</span>
            <h3>Dal documento allo smaltimento.</h3>
            <p>Gestisci i RAEE dall’emissione della documentazione fino allo smaltimento. Segui le relative attività e gli stati nel gestionale, insieme alle consegne.</p>
          </article>
          <article class="feature reveal">
            <span class="num">08 / ACCESSI UTENTE</span>
            <h3>Un accesso per ogni persona coinvolta.</h3>
            <p>Crei più utenti per punti vendita, consegnatari e operatori. Le persone coinvolte accedono allo stesso gestionale per svolgere le proprie attività.</p>
          </article>
          <article class="feature reveal">
            <span class="num">09 / LISTINI E PROFORMA</span>
            <h3>Ogni cliente ha il suo listino.</h3>
            <p>Imposti tariffe diverse per ciascun committente. HUBSTRA valorizza le prestazioni secondo il listino e ti permette di scaricare le proforma a fine mese.</p>
          </article>
        </div>
      </section>
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
          <article class="step reveal">
            <span>01 / IL PUNTO VENDITA</span>
            <h3>Comunica l’appuntamento alla vendita.</h3>
            <p>Consulta le disponibilità pianificate e comunica al consumatore data e fascia oraria mentre acquista. Il cliente può organizzarsi per ricevere la consegna.</p>
          </article>
          <article class="step reveal">
            <span>02 / IL TUO UFFICIO</span>
            <h3>Organizza le attività e segue gli esiti.</h3>
            <p>Importa gli ordini, pianifica le zone e le fasce, assegna le consegne e genera i borderò. Riceve le segnalazioni e gestisce RAEE, listini e proforma.</p>
          </article>
          <article class="step reveal">
            <span>03 / LA SQUADRA</span>
            <h3>Documenta la consegna dal campo.</h3>
            <p>Consulta le attività assegnate, raccoglie foto e firma grafica e registra l’esito dell’intervento. L’ufficio riceve le comunicazioni sulle anomalie.</p>
          </article>
        </div>
      </section>
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
          <details>
            <summary>Come viene definita la fascia al momento della vendita?</summary>
            <p>Il punto vendita consulta le disponibilità definite nella pianificazione operativa. In questo modo può comunicare al consumatore data e fascia di consegna già all’acquisto. Le disponibilità dipendono dalle zone e dalle fasce che hai organizzato.</p>
          </details>
          <details>
            <summary>Chi può utilizzare HUBSTRA?</summary>
            <p>Puoi creare utenti per punti vendita, consegnatari e operatori. Il punto vendita gestisce gli appuntamenti alla vendita, l’ufficio organizza il lavoro e le squadre consultano e documentano le attività assegnate.</p>
          </details>
          <details>
            <summary>Quali comunicazioni posso automatizzare?</summary>
            <p>Puoi gestire SMS automatici al consumatore. Le anomalie e le consegne da riprogrammare vengono comunicate via email in tempo reale al tuo ufficio e ai committenti.</p>
          </details>
          <details>
            <summary>Come vengono documentate le consegne?</summary>
            <p>La squadra raccoglie foto durante l’intervento e la firma grafica del cliente, e registra l’esito della consegna. Le informazioni restano associate all’attività svolta.</p>
          </details>
          <details>
            <summary>Quali file posso importare ed esportare?</summary>
            <p>Puoi importare ordini da Excel e PDF ed esportare i dati in Excel. I borderò per le consegne sono disponibili in PDF. In demo possiamo esaminare i tuoi formati e mostrarti il flusso di lavoro.</p>
          </details>
          <details>
            <summary>Quali fasi dei RAEE posso gestire?</summary>
            <p>HUBSTRA gestisce i RAEE dall’emissione della documentazione fino allo smaltimento. Le schermate dedicate consentono di consultare i ritiri e i relativi stati.</p>
          </details>
          <details>
            <summary>Posso impostare tariffe diverse per ciascun committente?</summary>
            <p>Sì. Puoi creare un listino per ogni committente. Le prestazioni vengono valorizzate secondo le tariffe impostate e puoi scaricare le proforma di fine mese.</p>
          </details>
        </div>
      </section>
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
          data-demo
        >
          Richiedi una demo
        </button>
      </section>
    </main>
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <p>Data e fascia già alla vendita.<br>Ordini, consegne e RAEE nello stesso gestionale.</p>
          <a href="#inizio">Torna all’inizio ↑</a>
        </div>
        <div
          class="footer-brand"
          aria-hidden="true"
        >
          HUBSTRA
        </div>
        <div class="footer-bottom">
          <span>© 2026 HUBSTRA</span>
          <div class="legal-links">
            <a
              href="#privacy"
              data-policy="privacy"
            >Privacy</a>
            <a
              href="#cookie"
              data-policy="cookie"
            >Cookie</a>
          </div>
        </div>
      </div>
    </footer>
    <dialog
      id="menu"
      class="menu-dialog"
      aria-labelledby="menu-title"
    >
      <button
        class="dialog-close"
        data-close
        aria-label="Chiudi menu"
      >
        ×
      </button>
      <p
        id="menu-title"
        class="kicker"
      >
        Esplora HUBSTRA
      </p>
      <nav
        class="menu-links"
        aria-label="Menu"
      >
        <a href="#vantaggi">Perché HUBSTRA</a>
        <a href="#piattaforma">La piattaforma</a>
        <a href="#come-funziona">Come funziona</a>
        <a href="#domande">Domande frequenti</a>
      </nav>
      <button
        class="button"
        data-demo
      >
        Richiedi una demo
      </button>
    </dialog>
    <dialog
      id="demo-dialog"
      class="demo-dialog"
      aria-labelledby="demo-title"
    >
      <button
        class="dialog-close"
        data-close
        aria-label="Chiudi modulo demo"
      >
        ×
      </button>
      <div class="dialog-scroll">
        <p class="kicker">
          Richiedi una demo di HUBSTRA.
        </p>
        <h2 id="demo-title">
          Partiamo dalle<br>
          <em class="serif">tue consegne.</em>
        </h2>
        <p>Indica la tua azienda e come ricontattarti. Organizzeremo una demo per mostrarti HUBSTRA e approfondire le tue esigenze.</p>
        <form id="demo-form">
          <input
            name="sito_web"
            class="sr-only"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          >
          <div class="form-grid">
            <label>Nome e cognome *<input
              name="nome"
              autocomplete="name"
              required
              maxlength="100"
            >
            </label>
            <label>Ragione sociale *<input
              name="azienda"
              autocomplete="organization"
              required
              maxlength="150"
            >
            </label>
            <label>Email aziendale *<input
              type="email"
              name="email"
              autocomplete="email"
              required
              maxlength="150"
            >
            </label>
            <label>Numero di cellulare *<input
              type="tel"
              name="cellulare"
              autocomplete="tel"
              required
              maxlength="30"
              minlength="6"
              placeholder="Es. +39 333 1234567"
            >
            </label>
            <label>Partita IVA
              <input
                name="partita_iva"
                maxlength="30"
                placeholder="Es. IT12345678901"
              >
            </label>
            <label>La tua attività<select name="attivita">
              <option>Trasportatore / logistica</option>
              <option>Punto vendita / retail</option>
              <option>Altro</option>
            </select>
            </label>
            <label class="full">Indirizzo aziendale
              <input
                name="indirizzo"
                autocomplete="street-address"
                maxlength="200"
                placeholder="Via e numero civico"
              >
            </label>
            <label>Città
              <input
                name="citta"
                autocomplete="address-level2"
                maxlength="100"
              >
            </label>
            <label>CAP
              <input
                name="cap"
                autocomplete="postal-code"
                maxlength="12"
              >
            </label>
            <label class="full">Di cosa hai bisogno?
              <textarea
                name="messaggio"
                maxlength="2000"
                placeholder="Consegne, RAEE, SMS, utenti, proforma…"
              />
            </label>
          </div>
          <p class="privacy-short">
            Useremo i recapiti per rispondere alla tua richiesta e organizzare la demo. Non ti iscrivi a newsletter. Leggi l’<a
              href="#privacy"
              data-policy="privacy"
            >informativa privacy</a>. I campi con * sono necessari per ricontattarti; gli altri sono facoltativi.
          </p>
          <button
            id="submit-demo"
            type="submit"
            class="button"
          >
            Invia richiesta
          </button>
          <p
            id="form-note"
            class="form-note"
          >
            La richiesta viene inviata al nostro team, che ti ricontatterà per organizzare la demo.
          </p>
          <p
            id="form-status"
            class="status"
            role="status"
          />
        </form>
      </div>
    </dialog>

    <dialog
      id="privacy"
      class="legal-dialog"
      aria-labelledby="privacy-title"
    >
      <button
        class="dialog-close"
        data-close
        aria-label="Chiudi informativa privacy"
      >
        ×
      </button>
      <div class="dialog-scroll">
        <p class="kicker">
          I tuoi dati, con chiarezza.
        </p>
        <h2 id="privacy-title">
          Informativa privacy
        </h2>
        <p class="legal-draft">
          Bozza da completare prima della pubblicazione: devono essere confermati titolare, recapito privacy, fornitori, trasferimenti e tempi di conservazione.
        </p>
        <p class="legal-date">
          Aggiornamento: 3 ottobre 2026 · Informativa ai sensi dell’art. 13 del Regolamento (UE) 2016/679.
        </p>
        <h3>1. Chi tratta i dati</h3>
        <p>Il titolare del trattamento è <strong>Italco.mi Logistribuzioni srls</strong>, con sede in Via Emanuele Filiberto Duca 24/A, 72023 Mesagne (BR), P. IVA IT02735550747. Per richieste relative ai dati personali: <a href="mailto:italco.misrls@pec.it">italco.misrls@pec.it</a>.</p>
        <h3>2. Quali dati vengono raccolti</h3>
        <p>Il modulo demo richiede nome del referente, ragione sociale, email aziendale e numero di cellulare. Puoi aggiungere volontariamente partita IVA, indirizzo aziendale, città, CAP, tipo di attività e un messaggio. Non inserire nel messaggio dati relativi alla salute o altre informazioni particolarmente delicate.</p>
        <p>Quando invii il modulo, i dati vengono trasmessi al nostro server, conservati in archivio e inoltrati via email alle persone incaricate di gestire le richieste. Il modulo non li salva in cookie o archivi del browser.</p>
        <h3>3. Perché vengono utilizzati e su quale base</h3>
        <p>I dati ricevuti saranno usati per rispondere alla richiesta, ricontattarti via email o telefono, organizzare e presentare la demo e svolgere le attività precontrattuali da te richieste. La base giuridica è l’art. 6, par. 1, lett. b) del GDPR, quando applicabile. Per il referente che agisce per conto di una società, la base è il legittimo interesse del titolare a gestire le richieste professionali ricevute, ai sensi dell’art. 6, par. 1, lett. f).</p>
        <p>La richiesta demo non comporta iscrizione a newsletter né invio di campagne promozionali non richieste. Non vengono adottate decisioni automatizzate o attività di profilazione tramite questo modulo.</p>
        <h3>4. Dati necessari e facoltativi</h3>
        <p>I campi contrassegnati con * permettono di identificare la richiesta e ricontattarti. Senza questi dati non è possibile completare il modulo. Partita IVA, indirizzo e altri dettagli aziendali sono facoltativi: puoi richiedere la demo anche senza compilarli.</p>
        <h3>5. Chi può accedere ai dati</h3>
        <p>Potranno accedere ai dati le persone autorizzate a gestire le demo e i fornitori necessari per hosting, posta elettronica e gestione delle richieste, nominati responsabili del trattamento ove richiesto. I dati non saranno diffusi pubblicamente.</p>
        <p>
          <strong>Fornitori e localizzazione del trattamento:</strong> [Da completare dopo la scelta di hosting e servizio email]. Se il servizio prevede trasferimenti fuori dallo Spazio economico europeo, questa informativa dovrà indicare i paesi interessati e le garanzie applicabili ai sensi degli artt. 44–49 GDPR, prima dell’attivazione.
        </p>
        <h3>6. Per quanto tempo vengono conservati</h3>
        <p>I dati delle richieste ricevute saranno conservati per il tempo necessario a gestire la demo e l’eventuale seguito precontrattuale. <strong>Termine o criterio operativo di cancellazione:</strong> [Da definire e confermare dal titolare prima dell’attivazione]. In caso di instaurazione di un rapporto contrattuale, saranno fornite le informazioni sul relativo trattamento e sui termini di conservazione.</p>
        <h3>7. I tuoi diritti</h3>
        <p>
          Nei casi e nei limiti previsti dal GDPR, puoi chiedere accesso ai dati, rettifica, cancellazione, limitazione del trattamento e portabilità, nonché opporti al trattamento fondato sul legittimo interesse. Le richieste possono essere inviate al recapito privacy del titolare indicato sopra. Puoi presentare reclamo al <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
          >Garante per la protezione dei dati personali</a>.
        </p>
        <h3>8. Dati di navigazione e aggiornamenti</h3>
        <p>Il codice della pagina non integra strumenti di analisi, pubblicità o tracciamento. Dopo la pubblicazione, l’hosting potrà trattare dati tecnici come indirizzo IP, data e ora della richiesta e informazioni sul browser. Finalità, base giuridica e conservazione degli eventuali log dovranno essere specificate dopo la scelta del fornitore. L’informativa verrà aggiornata in caso di modifiche ai servizi utilizzati.</p>
      </div>
    </dialog>
    <dialog
      id="cookie"
      class="legal-dialog"
      aria-labelledby="cookie-title"
    >
      <button
        class="dialog-close"
        data-close
        aria-label="Chiudi informativa cookie"
      >
        ×
      </button>
      <div class="dialog-scroll">
        <p class="kicker">
          Navigazione senza tracciamento.
        </p>
        <h2 id="cookie-title">
          Informativa cookie
        </h2>
        <p class="legal-date">
          Aggiornamento: 3 ottobre 2026 · Riferita al codice di questa versione del sito.
        </p>
        <h3>Quali cookie usa questa pagina?</h3>
        <p>Questa versione non imposta cookie e non utilizza localStorage o sessionStorage. Non contiene strumenti pubblicitari, pixel di tracciamento, analytics, video incorporati o font caricati da fornitori esterni. Menu, carosello e animazioni funzionano senza salvare identificatori sul dispositivo.</p>
        <h3>Il modulo demo salva i miei dati?</h3>
        <p>Il modulo non salva i dati in cookie o archivi del browser: i dati che compili vengono trasmessi solo quando invii la richiesta, per essere gestiti come descritto nell’informativa privacy. Chiudere la pagina senza inviare elimina quanto scritto, ferma restando l’eventuale compilazione automatica del browser.</p>
        <h3>Perché non compare un banner di consenso?</h3>
        <p>La pagina non installa strumenti di tracciamento per cui raccogliere un consenso. Per i soli cookie strettamente tecnici non è richiesto un consenso preventivo; se verranno aggiunti strumenti che lo richiedono, dovranno restare bloccati fino alla scelta dell’utente, con possibilità di rifiutare e revocare il consenso.</p>
        <h3>Cosa cambia quando il sito viene pubblicato?</h3>
        <p>Prima della pubblicazione occorre verificare anche il comportamento dell’hosting e dei servizi eventualmente collegati. Se questi aggiungono cookie o altri identificatori, l’informativa deve indicarne nome, finalità, fornitore e durata. Gli eventuali strumenti non necessari devono essere gestiti con un meccanismo di consenso coerente con le loro caratteristiche.</p>
        <h3>Come gestire i cookie del browser</h3>
        <p>
          Puoi controllare ed eliminare i cookie nelle impostazioni del tuo browser. Per i dati personali e i recapiti del titolare consulta l’<a
            href="#privacy"
            data-policy="privacy"
          >informativa privacy</a>. Le fonti di riferimento sono le <a
            href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876"
            target="_blank"
            rel="noopener noreferrer"
          >Linee guida del Garante su cookie e strumenti di tracciamento</a>.
        </p>
      </div>
    </dialog>

    <dialog
      id="screen-zoom"
      class="zoom-dialog"
      aria-labelledby="zoom-title"
    >
      <button
        class="dialog-close"
        data-close
        aria-label="Chiudi schermata"
      >
        ×
      </button>
      <h2 id="zoom-title">
        Dashboard e indicatori
      </h2>
      <img
        id="zoom-image"
        alt=""
      >
      <p>Anteprima del gestionale · Tutti i dati mostrati sono dimostrativi.</p>
    </dialog>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import '@/views/landing/landing.css';

const root = ref(null);
const previousTitle = document.title;
let observer = null;

onMounted(() => {
  document.title = 'HUBSTRA — Data e fascia di consegna già alla vendita.';
  document.documentElement.classList.add('landing-page');
  setup(root.value);
});

onBeforeUnmount(() => {
  document.title = previousTitle;
  document.documentElement.classList.remove('landing-page');
  document.body.classList.remove('landing-lock');
  observer?.disconnect();
});

// Menu, carosello, modali, FAQ e modulo demo, come nella pagina statica originale.
const setup = (el) => {
  const $ = (id) => el.querySelector('#' + id);
  const $$ = (selector) => [...el.querySelectorAll(selector)];
  const lock = (on) => document.body.classList.toggle('landing-lock', on);

  const menu = $('menu');
  const demo = $('demo-dialog');

  const openDialog = (dialog) => {
    $$('dialog[open]').forEach((d) => d.close());
    dialog.showModal();
    lock(true);
  };

  for (const dialog of $$('dialog')) {
    dialog.addEventListener('close', () => {
      if (!el.querySelector('dialog[open]'))
        lock(false);
    });
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog)
        return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    });
  }

  $$('[data-policy]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const dialog = $(a.dataset.policy);
    if (!dialog.open)
      dialog.showModal();
    lock(true);
  }));

  $('open-menu').addEventListener('click', () => openDialog(menu));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.close()));
  $$('[data-demo]').forEach((b) => b.addEventListener('click', () => openDialog(demo)));

  // Carosello delle schermate.
  const screens = $$('.screen');
  const dots = $$('[data-slide]');
  const captions = [
    'Dashboard: ordini, consegne e indicatori',
    'RAEE: dall’emissione allo smaltimento',
    'Copertura corrieri: calendario e fasce operative',
    'Ordini: destinatari, appuntamenti e attività'
  ];
  let current = 0;

  const setSlide = (n) => {
    current = (n + screens.length) % screens.length;
    screens.forEach((s, i) => {
      let p = (i - current + screens.length) % screens.length;
      if (p === screens.length - 1)
        p = -1;
      s.dataset.pos = p;
      s.setAttribute('aria-hidden', String(p !== 0));
      s.inert = p !== 0;
    });
    dots.forEach((d, i) => d.setAttribute('aria-pressed', String(i === current)));
    $('gallery-caption').textContent = captions[current] + ' · Dati dimostrativi';
  };

  $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const card = screens[Number(b.dataset.zoom)];
    const img = card.querySelector('img');
    $('zoom-image').src = img.src;
    $('zoom-image').alt = img.alt;
    $('zoom-title').textContent = card.querySelector('.product-screen-caption span').textContent;
    openDialog($('screen-zoom'));
  }));

  $('previous').addEventListener('click', () => setSlide(current - 1));
  $('next').addEventListener('click', () => setSlide(current + 1));
  dots.forEach((d) => d.addEventListener('click', () => setSlide(Number(d.dataset.slide))));

  const stage = $('stage');
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setSlide(current + (e.key === 'ArrowRight' ? 1 : -1));
    }
  });

  let touchStart = null;
  stage.addEventListener('touchstart', (e) => {
    touchStart = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchStart === null)
      return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 45)
      setSlide(current + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });

  // Comparsa delle sezioni allo scroll.
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }), { threshold: .08 });
    $$('.reveal').forEach((item) => observer.observe(item));
  } else {
    $$('.reveal').forEach((item) => item.classList.add('visible'));
  }

  // Modulo demo: l'invio passa dal backend, che lo gira via email a chi gestisce le richieste.
  const form = $('demo-form');
  const submit = $('submit-demo');
  const status = $('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(form));

    submit.disabled = true;
    status.textContent = 'Invio in corso…';
    try {
      const response = await fetch(`${import.meta.env.VITE_HOSTNAME}demo-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      // Il successo si conferma solo dopo la risposta del server.
      if (response.ok && data.status === 'ok') {
        form.reset();
        status.textContent = 'Richiesta inviata. Ti ricontatteremo al più presto per organizzare la demo.';
      } else {
        status.textContent = data.message || 'Invio non riuscito, riprova più tardi.';
      }
    } catch {
      status.textContent = 'Impossibile inviare la richiesta: controlla la connessione e riprova.';
    } finally {
      submit.disabled = false;
    }
  });
};
</script>
