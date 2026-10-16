import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';
import rae from '@/utils/rae';

export const useRaeProductGroupStore = defineStore('raeProductGroup', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'rae/product-group',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `rae/product-group/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at']) },
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
        'rae/product-group',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `rae/product-group/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.rae_product_groups;
      this.ready = true;
    }
  }
});
