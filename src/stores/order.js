import http from '@/utils/http';
import { defineStore } from 'pinia';
import orderUtils from '@/utils/order';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'delivery_group', 'services', 'user', 'collection_point', 'addressee'
];

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    dateFilter: {},
    activeForm: false,
    activeSecondForm: false
  }),
  actions: {
    createElement(router, func) {
      this.element.products = Object.keys(this.element.products).map(key => this.element.products[key]);
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
          Object.entries(this.element).filter(([key]) => !EXCLUDED_KEYS.includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    updateElementWithFormData(router, func) {
      http.formDataRequest(
        `order/${this.element.id}`,
        {
          data: JSON.stringify(Object.fromEntries(
            Object.entries(this.element).filter(([key]) => !EXCLUDED_KEYS.concat(['photo']).includes(key))
          )),
          photo: this.element.photo
        },
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.postRequest(
        'order/filter',
        {
          date_filter: this.dateFilter,
          filters: orderUtils.formatFilters(this.filters)
        },
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
