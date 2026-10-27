import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

// Schedulazione settimanale della copertura corrieri: blocchi per giorno
// della settimana (Lunedì = 0 ... Domenica = 6), ciascuno con un veicolo,
// una fascia oraria e i CAP coperti in quel blocco. Più blocchi sullo
// stesso giorno sono normali (fasce orarie diverse). Nome e targa del
// veicolo si risolvono lato frontend dal transport_id via useTransportStore,
// niente join nella risposta.
export const useDeliveryCoverageStore = defineStore('deliveryCoverage', {
  state: () => ({
    entries: [],
    element: {},
    ready: false,
    error: null,
    entryForm: false
  }),
  actions: {
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'delivery-coverage',
        'GET',
        {},
        callback
      ));
    },
    createEntry(func) {
      http.makeRequest(
        'delivery-coverage',
        'POST',
        { body: this.element },
        func
      );
    },
    updateEntry(func) {
      http.makeRequest(
        `delivery-coverage/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'company_id']) },
        func
      );
    },
    deleteEntry(element, func) {
      http.makeRequest(
        `delivery-coverage/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      // Risposta ko (piano non attivo, ruolo non ammesso): niente blocchi e un messaggio,
      // invece di una lista undefined che rompe calendario e mappa.
      if (!Array.isArray(data?.entries)) {
        this.entries = [];
        this.error = data?.message || 'Impossibile caricare la copertura';
      } else {
        this.entries = data.entries;
        this.error = null;
      }
      this.ready = true;
    }
  }
});
