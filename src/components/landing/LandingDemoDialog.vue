<template>
  <landing-dialog
    id="demo-dialog"
    class="demo-dialog"
    aria-labelledby="demo-title"
    close-label="Chiudi modulo demo"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="dialog-scroll">
      <p class="kicker">
        Richiedi una demo di HUBSTRA.
      </p>
      <h2 id="demo-title">
        Partiamo dalle<br>
        <em class="serif">tue consegne.</em>
      </h2>
      <p>Indica la tua azienda e come ricontattarti. Organizzeremo una demo per mostrarti HUBSTRA e approfondire le tue esigenze.</p>
      <form
        ref="form"
        @submit.prevent="submit"
      >
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
            @click.prevent="emit('open-policy', 'privacy')"
          >informativa privacy</a>. I campi con * sono necessari per ricontattarti; gli altri sono facoltativi.
        </p>
        <button
          type="submit"
          class="button"
          :disabled="sending"
        >
          Invia richiesta
        </button>
        <p class="form-note">
          La richiesta viene inviata al nostro team, che ti ricontatterà per organizzare la demo.
        </p>
        <p
          class="status"
          role="status"
        >
          {{ status }}
        </p>
      </form>
    </div>
  </landing-dialog>
</template>

<script setup>
import { ref } from 'vue';
import LandingDialog from '@/components/landing/LandingDialog.vue';

defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'open-policy']);

const form = ref(null);
const sending = ref(false);
const status = ref('');

// L'invio passa dal backend, che lo gira via email a chi gestisce le richieste.
const submit = async () => {
  const body = Object.fromEntries(new FormData(form.value));

  sending.value = true;
  status.value = 'Invio in corso…';
  try {
    const response = await fetch(`${import.meta.env.VITE_HOSTNAME}demo-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    // Il successo si conferma solo dopo la risposta del server.
    if (response.ok && data.status === 'ok') {
      form.value.reset();
      status.value = 'Richiesta inviata. Ti ricontatteremo al più presto per organizzare la demo.';
    } else {
      status.value = data.message || 'Invio non riuscito, riprova più tardi.';
    }
  } catch {
    status.value = 'Impossibile inviare la richiesta: controlla la connessione e riprova.';
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.demo-dialog {
  width: 620px;
  padding: 45px;
}
.demo-dialog h2 {
  font-size: 38px;
  font-weight: 500;
  letter-spacing: -1.8px;
  margin: 5px 0 15px;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 27px 0 20px;
}
label {
  display: grid;
  gap: 9px;
  font-size: 14px;
  color: #514a61;
}
.full {
  grid-column: 1/-1;
}
input,
select,
textarea {
  width: 100%;
  padding: 13px;
  border: 1px solid #d9d4e5;
  background: white;
  color: #191322;
  border-radius: 8px;
  min-width: 0;
}
textarea {
  resize: vertical;
  min-height: 90px;
}
.form-note {
  font-size: 12px!important;
  line-height: 1.6;
  color: #7b738d!important;
}
.status {
  font-size: 14px;
  line-height: 1.6;
  color: var(--blue);
  margin-top: 18px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 650px) {
  .demo-dialog {
    padding: 40px 25px;
    max-height: 90dvh;
    overflow: auto;
  }
  .demo-dialog h2 {
    font-size: 32px;
  }
  .form-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .form-grid .full {
    grid-column: auto;
  }
}
.privacy-short {
  font-size: 13px;
  line-height: 1.7;
  color: #625b70;
}
.demo-dialog {
  max-height: 90dvh;
  overflow: auto;
}
.demo-dialog .dialog-scroll {
  padding: 33px 37px 33px 45px;
}
@media (max-width: 650px) {
  .demo-dialog .dialog-scroll {
    padding: 28px 17px 28px 25px;
  }
}
</style>
