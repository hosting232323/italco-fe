import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useCollectionPointStore = defineStore('collectionPoint', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'collection-point',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `collection-point/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']) },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'collection-point',
        'GET',
        {},
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `collection-point/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.collection_points;
      this.ready = true;
    }
  }
});
