<template>
  <landing-dialog
    id="cookie"
    class="legal-dialog"
    aria-labelledby="cookie-title"
    close-label="Chiudi informativa cookie"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
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
          @click.prevent="emit('open-policy', 'privacy')"
        >informativa privacy</a>. Le fonti di riferimento sono le <a
          href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876"
          target="_blank"
          rel="noopener noreferrer"
        >Linee guida del Garante su cookie e strumenti di tracciamento</a>.
      </p>
    </div>
  </landing-dialog>
</template>

<script setup>
import LandingDialog from '@/components/landing/LandingDialog.vue';

defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'open-policy']);
</script>
