import http from '@/utils/http';
import { defineStore } from 'pinia';
import orderUtils from '@/utils/order';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'delivery_group', 'services', 'user', 'collection_point', 'dates_form'
];

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    ready: false,
    dateFilter: {},
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
          Object.entries(this.element).filter(([key]) => !EXCLUDED_KEYS.includes(key))
        ),
        func,
        'PUT',
        router
      );
    },
    updateElementWithFormData(router, func) {
      const content = {data: JSON.stringify(Object.fromEntries(
        Object.entries(this.element).filter(([key]) => !EXCLUDED_KEYS.concat(['photo']).includes(key))))};
      this.element.photos.forEach(element => content[element.name] = element);

      http.formDataRequest(
        `order/${this.element.id}`,
        content,
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
    initListDelivery(router) {
      http.getRequest(
        'order/delivery',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.orders;
      this.ready = true;
    }
  }
});
