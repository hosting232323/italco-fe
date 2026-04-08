import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

const EXCLUDED_KEYS = [
  'created_at', 'updated_at', 'delivery_group', 'services', 'user', 'dates_form', 'schedulation'
];

export const useOrderStore = defineStore('order', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    ready: false,
    activeForm: false,
    filtersSetting: {
      doubleDates: false,
      dateType: Object.keys(storesUtils.ORDER_DATE_FILTER_TYPES)[0]
    }
  }),
  actions: {
    createElement(router, func) {
      http.postRequest(
        'order',
        storesUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'POST',
        router
      );
    },
    updateElement(router, func) {
      http.postRequest(
        `order/${this.element.id}`,
        storesUtils.exclude_keys(this.element, EXCLUDED_KEYS),
        func,
        'PUT',
        router
      );
    },
    updateElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, EXCLUDED_KEYS.concat(['photo'])))
      };

      if (this.element.photos)
        this.element.photos.forEach(element => content[element.name] = element);
      if (this.element.signature)
        content.signature = this.element.signature; 

      http.uploadRequest(
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
        {filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.ORDER_DATE_FILTER_TYPES,
          'Order'
        )},
        this.setList,
        'POST',
        router
      );
    },
    setList(data) {
      this.list = data.orders;
      this.ready = true;
    }
  }
});
