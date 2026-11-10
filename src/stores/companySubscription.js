import http from '@/utils/http';
import { defineStore } from 'pinia';


// Prezzo e stato dell'abbonamento di una company scelta dal super admin dalla
// tabella Company (può non coincidere con quella su cui sta operando): come
// companyRaeDisposalPlace, companyId vive nello store e non entra in
// tenantStores.js perché non sono "dati della mia company".
export const useCompanySubscriptionStore = defineStore('companySubscription', {
  state: () => ({
    companyId: null,
    dialogOpen: false,
    priceCents: null,
    subscription: { status: 'none', active: false, current_period_end: null, cancel_at_period_end: false },
    ready: false,
    // Storico letto da Stripe: si carica a parte dal prezzo (e può fallire da solo).
    history: { subscriptions: [], invoices: [], summary: null },
    historyReady: false,
    historyMessage: ''
  }),
  actions: {
    open(companyId) {
      this.companyId = companyId;
      this.dialogOpen = true;
      this.ready = false;
      this.initData();
      this.initHistory();
    },
    setData(data) {
      this.priceCents = data.price_cents ?? null;
      this.subscription = data.subscription;
      this.ready = true;
    },
    initData(func) {
      http.makeRequest(`subscription/company/${this.companyId}`, 'GET', {}, (data) => {
        if (data.status == 'ok') this.setData(data);
        if (func) func(data);
      });
    },
    initHistory(func) {
      this.historyReady = false;
      this.historyMessage = '';
      http.makeRequest(`subscription/company/${this.companyId}/history`, 'GET', {}, (data) => {
        if (data.status == 'ok')
          this.history = { subscriptions: data.subscriptions, invoices: data.invoices, summary: data.summary };
        else
          this.historyMessage = data.message || 'Errore nella lettura dello storico';
        this.historyReady = true;
        if (func) func(data);
      });
    },
    // Il nuovo prezzo vale anche per l'abbonamento già attivo, dal prossimo rinnovo.
    updatePrice(priceCents, func) {
      http.makeRequest(
        `subscription/company/${this.companyId}/price`,
        'PUT',
        { body: { price_cents: priceCents } },
        (data) => {
          if (data.status == 'ok') this.setData(data);
          if (func) func(data);
        }
      );
    }
  }
});
