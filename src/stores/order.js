import http from '@/utils/http';
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    element: {},
    list: [],
    filters: {},
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'order',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `order/${this.element.id}`,
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => ![
            'created_at', 'updated_at', 'delivery_group', 'service', 'user', 'collection_point'
          ].includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.postRequest(
        'order/filter',
        {filters: Object.keys(this.filters).map(key => {
          return {
            value: this.filters[key],
            model: key.split('.')[0],
            field: key.split('.')[1]
          }
        })},
        this.setList,
        'POST',
        router
      );
    },
    setList(data) {
      this.list = data.orders;
    }
  }
});
