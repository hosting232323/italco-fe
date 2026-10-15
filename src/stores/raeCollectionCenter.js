import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';
import rae from '@/utils/rae';

export const useRaeCollectionCenterStore = defineStore('raeCollectionCenter', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false,
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'rae/collection-center',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `rae/collection-center/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']) },
        func
      );
    },
    deleteElement(element, func) {
      http.makeRequest(
        `rae/collection-center/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    initList() {
      // Attività senza modulo RAEE: nessuna lista da chiedere, ma ready va
      // messo lo stesso o getStoreList continuerebbe a richiamare initList.
      if (!rae.isEnabled()) {
        this.list = [];
        this.ready = true;
        return;
      }

      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'rae/collection-center',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.rae_collection_centers;
      this.ready = true;
    }
  }
});
