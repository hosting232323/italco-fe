import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useDeliveryGroupStore = defineStore('deliveryGroup', {
  state: () => ({
    element: {},
    list: [],
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'delivery_group',
        this.element,
        func,
        'POST',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'delivery_group',
        {},
        this.setList,
        'GET',
        router
      );
    },
    deleteElement(element, router, func) {
      http.getRequest(
        `delivery_group/${element.id}`,
        {},
        func,
        'DELETE',
        router
      );
    },
    assignUser(userId, router, func) {
      http.postRequest(
        'delivery_group/user',
        {
          user_id: userId,
          delivery_group_id: this.element.id
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
