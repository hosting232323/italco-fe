import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useDeliveryGroupStore = defineStore('deliveryGroup', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'delivery-group',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'delivery-group',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `delivery-group/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    assignUser(userId, router, func, deassign = false) {
      http.postRequest(
        'delivery-group/user',
        {
          user_id: userId,
          delivery_group_id: deassign ? null : this.element.id
        },
        func,
        'PATCH',
        router
      );
    },
    setList(data) {
      this.list = data.delivery_groups;
    }
  }
});
