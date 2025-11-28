import http from '@/utils/http';
import { defineStore } from 'pinia';
import orderUtils from '@/utils/order';
import storeUtils from '@/utils/stores';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'delivery_group', 'services', 'user', 'dates_form'
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
        storeUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `order/${this.element.id}`,
        storeUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'PUT',
        router
      );
    },
    updateElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storeUtils.exclude_keys(this.element, EXCLUDED_KEYS.concat(['photo'])))
      };

      if (this.element.photos)
        this.element.photos.forEach(element => content[element.name] = element);
      if (this.element.signature)
        content.signature = this.element.signature; 

      http.formDataRequest(
        `order/${this.element.id}`,
        content,
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      Object.keys(this.filters).forEach(key => {
        if (!this.filters[key]) delete this.filters[key];
      });

      http.postRequest(
        'order/filter',
        {filters: orderUtils.formatFilters({ ...this.filters })},
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
