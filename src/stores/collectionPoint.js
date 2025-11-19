import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useCollectionPointStore = defineStore('collectionPoint', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'collection-point',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `collection-point/${this.element.id}`,
        storeUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'collection-point',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `collection-point/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.collection_points;
      this.ready = true;
    }
  }
});
