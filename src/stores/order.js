import http from '@/utils/http';
import { defineStore } from 'pinia';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'delivery_group', 'services', 'user', 'collection_point', 'products', 'addressee'
];

export const useOrderStore = defineStore('order', {
  state: () => ({
    element: {},
    list: [],
    filters: {},
    activeForm: false,
    activeSecondForm: false
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
