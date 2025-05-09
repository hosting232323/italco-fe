import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useCollectionPointStore = defineStore('collectionPoint', {
  state: () => ({
    element: {},
    list: [],
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
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !['created_at', 'updated_at', 'users'].includes(key))
        ),
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
    }
  }
});
