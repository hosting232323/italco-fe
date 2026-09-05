import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';
import rae from '@/utils/rae';

export const useRaeDisposalPlaceStore = defineStore('raeDisposalPlace', {
  state: () => ({
    list: [],
    ready: false
  }),
  actions: {
    // Sola lettura: la gestione (crea/modifica/elimina) è del super admin da
    // Gestione Company, su un'altra rotta (vedi companyRaeDisposalPlace.js).
    // Questo store serve solo al form di smaltimento per proporre/scegliere
    // il luogo dell'attività corrente.
    initList() {
      // Attività senza modulo RAEE: nessuna lista da chiedere, ma ready va
      // messo lo stesso o getStoreList continuerebbe a richiamare initList.
      if (!rae.isEnabled()) {
        this.list = [];
        this.ready = true;
        return;
      }

      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'rae/disposal-place',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.rae_disposal_places;
      this.ready = true;
    }
  }
});
