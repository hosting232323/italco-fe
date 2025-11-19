import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useServiceStore = defineStore('service', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    innerElement: {},
    activeForm: false,
    activePopUpForm: false
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
        storeUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users']),
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
      http.postRequest(
        'service/customer',
        {
          ...object,
          service_id: this.element.id
        },
        func,
        'POST',
        router
      );
    },
    updateServiceUserRelationships(object, router, func) {
      http.postRequest(
        `service/customer/${object.id}`,
        storeUtils.exclude_keys(object, ['created_at', 'updated_at']),
        func,
        'PUT',
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
      this.ready = true;
      if (this.activePopUpForm) {
        this.element = data.services.find(service => service.id === this.element.id);
        this.activePopUpForm = false;
        this.innerElement = {};
      }
    }
  }
});
