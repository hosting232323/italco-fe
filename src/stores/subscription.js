import http from '@/utils/http';
import { defineStore } from 'pinia';


export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    plans: [],
    subscription: { status: 'none', plan: null, active: false, current_period_end: null, cancel_at_period_end: false },
    ready: false,
    // Messaggio di errore dell'ultima azione (es. pagamento automatico non attivo).
    message: ''
  }),
  actions: {
    setSubscription(data) {
      if (data.status == 'ok') {
        this.subscription = data.subscription;
        this.message = '';
      } else {
        this.message = data.message || 'Errore durante la lettura dell\'abbonamento';
      }
    },
    initData(func) {
      http.makeRequest('subscription', 'GET', {}, (data) => {
        if (data.status == 'ok') this.plans = data.plans;
        this.setSubscription(data);
        this.ready = true;
        if (func) func(data);
      });
    },
    // Rilegge lo stato da Stripe: al ritorno da Checkout il webhook puo' non
    // essere ancora arrivato, e senza webhook (sviluppo) non arriva mai.
    sync(func) {
      http.makeRequest('subscription/sync', 'POST', {}, (data) => {
        this.setSubscription(data);
        if (func) func(data);
      });
    },
    // Checkout e portale sono pagine ospitate da Stripe: il backend ne restituisce
    // l'URL e il browser ci va, senza passare dal router.
    redirectTo(endpoint, body, func) {
      http.makeRequest(endpoint, 'POST', { body }, (data) => {
        if (data.status == 'ok') window.location.href = data.url;
        else this.message = data.message || 'Errore durante la richiesta a Stripe';
        if (func) func(data);
      });
    },
    startCheckout(plan, func) {
      this.redirectTo('subscription/checkout', { plan }, func);
    },
    openPortal(func) {
      this.redirectTo('subscription/portal', {}, func);
    }
  }
});
