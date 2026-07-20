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
    createElement(func) {
      http.makeRequest(
        'order',
        'POST',
        { body: storesUtils.exclude_keys(this.element, EXCLUDED_KEYS) },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `order/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, EXCLUDED_KEYS) },
        func
      );
    },
    updateElementWithFormData(func) {
      http.uploadRequest(
        `order/${this.element.id}`,
        'PUT',
        {
          body: storesUtils.exclude_keys(this.element, EXCLUDED_KEYS.concat(['photo', 'photos', 'signature'])),
          files: {
            photos: this.element.photos,
            signature: this.element.signature
          }
        },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'order/filter',
        'POST',
        { body: { filters: storesUtils.formatFilters(
          this.filters,
          storesUtils.ORDER_DATE_FILTER_TYPES,
          'Order'
        ) } },
        callback
      ));
    },
    setList(data) {
      this.list = data.orders;
      this.ready = true;
    }
  }
});
