import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeCollectionCenterStore = defineStore('raeCollectionCenter', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false,
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'rae/collection-center',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `rae/collection-center/${this.element.id}`,
        storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']),
        func,
        'PUT',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `rae/collection-center/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'rae/collection-center',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.rae_collection_centers;
      this.ready = true;
    }
  }
});
