<template>
  <landing-dialog
    id="privacy"
    class="legal-dialog"
    aria-labelledby="privacy-title"
    close-label="Chiudi informativa privacy"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
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
  </landing-dialog>
</template>

<script setup>
import LandingDialog from '@/components/landing/LandingDialog.vue';

defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue']);
</script>
