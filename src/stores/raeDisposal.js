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
    createElement(func) {
      http.makeRequest(
        'rae/disposal',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElementWithFormData(func) {
      const content = {
        data: JSON.stringify(storesUtils.exclude_keys(this.element, ['first_copy_document_fir', 'fourth_copy_document_fir']))
      };

      if (this.element.first_copy_document_fir)
        content.first_copy_document_fir = this.element.first_copy_document_fir.selectedFile;

      if (this.element.fourth_copy_document_fir)
        content.fourth_copy_document_fir = this.element.fourth_copy_document_fir.selectedFile;

      http.uploadRequest(
        `rae/disposal/${this.element.id}`,
        'PUT',
        { body: content },
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'rae/disposal',
        'GET',
        {},
        callback
      ));
    },
    setList(data) {
      this.list = data.rae_disposals;
      this.ready = true;
    }
  }
});
