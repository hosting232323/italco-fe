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
    entryForm: false,
    loadError: '',
    requestId: 0
  }),
  actions: {
    initList() {
      this.ready = false;
      this.loadError = '';
      const requestId = ++this.requestId;
      http.makeRequest(
        'delivery-coverage',
        'GET',
        {},
        (data) => {
          if (requestId !== this.requestId) return;
          if (data?.status === 'ok') {
            this.entries = data.entries || [];
            this.loadError = '';
          } else {
            this.entries = [];
            this.loadError = data?.message || 'Impossibile caricare la copertura corrieri.';
          }
          this.ready = true;
        }
      );
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
      this.entries = data?.entries || [];
      this.ready = true;
    }
  }
});
