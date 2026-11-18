import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

// Catalogo unificato dei punti di ritiro (admin e operatori): lo stesso indirizzo
// è una voce sola, condivisa dai punti di ritiro dei clienti.
export const usePickupPointStore = defineStore('pickupPoint', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'pickup-point',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `pickup-point/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'customers']) },
        func
      );
    },
    deleteElement(element, func) {
      http.makeRequest(
        `pickup-point/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    // Le voci `sourceIds` confluiscono in `targetId`: i punti dei clienti passano a quest'ultima.
    mergeElements(targetId, sourceIds, func) {
      http.makeRequest(
        'pickup-point/merge',
        'POST',
        { body: { target_id: targetId, source_ids: sourceIds } },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'pickup-point',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.pickup_points;
      this.ready = true;
    }
  }
});
