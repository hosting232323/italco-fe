import http from '@/utils/http';
import { defineStore } from 'pinia';
import { fileUtils } from 'generic-module';
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
      http.uploadRequest(
        `rae/disposal/${this.element.id}`,
        'PUT',
        {
          body: storesUtils.exclude_keys(this.element, ['first_copy_document_fir', 'fourth_copy_document_fir']),
          files: {
            first_copy_document_fir: this.element.first_copy_document_fir,
            fourth_copy_document_fir: this.element.fourth_copy_document_fir
          },
          extensions: fileUtils.pdfExtensions
        },
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
