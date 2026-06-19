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
    createElement(router, func) {
      http.postRequest(
        'rae/disposal',
        this.element,
        func,
        'POST',
        router
      );
    },
    updateElementWithFormData(router, func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['document_fir']))
      };

      if (this.element.document_fir)
        content.document_fir = this.element.document_fir.selectedFile;

      http.formDataRequest(
        `rae/disposal/${this.element.id}`,
        content,
        func,
        'PUT',
        router
      );
    },
    initList(router) {
      storesUtils.refreshList(this, (callback) => http.getRequest(
        'rae/disposal',
        {},
        callback,
        'GET',
        router
      ));
    },
    setList(data) {
      this.list = data.rae_disposals;
      this.ready = true;
    }
  }
});
