import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useRaeDisposalStore = defineStore('raeDisposal', {
  state: () => ({
    list: [],
    element: {},
    filters: {},
    ready: false
  }),
  actions: {
    createElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['document']))
      };
      
      if (this.element.document)
        content.document = this.element.document.selectedFile;

      http.formDataRequest(
        'rae/disposal',
        content,
        func,
        'POST',
        router
      );
    },
    updateElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['document']))
      };

      if (this.element.document)
        content.document = this.element.document.selectedFile;

      http.formDataRequest(
        `rae/disposal/${this.element.id}`,
        content,
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      http.getRequest(
        'rae/disposal',
        {},
        this.setList,
        'GET',
        router
      );
    },
    setList(data) {
      this.list = data.rae_disposals;
      this.ready = true;
    }
  }
});
