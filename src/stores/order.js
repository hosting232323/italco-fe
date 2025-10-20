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
    activeForm: false
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'order',
        Object.fromEntries(
          Object.entries(this.element).filter(([key]) => !EXCLUDED_KEYS.includes(key))
        ),
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
      if (this.element.photos)
        this.element.photos.forEach(element => content[element.name] = element);

      if (this.element.signature)
        content['signature'] = this.element.signature; 

      http.formDataRequest(
        `order/${this.element.id}`,
        content,
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      if (Object.keys(this.filters).length > 0)
        Object.keys(this.filters).forEach(key => {
          if (!this.filters[key]) delete this.filters[key];
        });

      http.postRequest(
        'order/filter',
        {
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
