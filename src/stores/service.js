import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'service',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `service/${this.element.id}`,
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
        'service',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `service/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    createServiceUserRelationships(object, router, func) {
      object.service_id = this.element.id;
      http.postRequest(
        'service/customer',
        object,
        func,
        'POST',
        router
      );
    },
    deleteServiceUserRelationships(object, router, func) {
      http.getRequest(
        `service/customer/${object.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    setList(data) {
      this.list = data.services;
    }
  }
});
