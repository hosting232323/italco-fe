import http from '@/utils/http';
import { defineStore } from 'pinia';
import storeUtils from '@/utils/stores';

export const useLogStore = defineStore('log', {
  state: () => ({
    list: [],
    filters: {},
    ready: false
  }),
  actions: {
    initList(router) {
      Object.keys(this.filters).forEach(key => {
        if (!this.filters[key]) delete this.filters[key];
      });

      http.getRequest(
        'log',
        {filters: storeUtils.formatFilters({ ...this.filters }, 'Log.created_at')},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.logs;
      this.ready = true;
    }
  }
});
