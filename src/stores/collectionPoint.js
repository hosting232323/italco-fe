import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

export const useCollectionPointStore = defineStore('collectionPoint', {
  state: () => ({
    list: [],
    element: {},
    ready: false,
    activeForm: false,
    customerId: null
  }),
  actions: {
    createElement(func) {
      http.makeRequest(
        'collection-point',
        'POST',
        { body: this.element },
        func
      );
    },
    updateElement(func) {
      http.makeRequest(
        `collection-point/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'users', 'preload_areas']) },
        func
      );
    },
    // Aree di precarico del punto (solo admin): per CAP e/o poligono [lat, lon].
    createPreloadArea(pointId, area, func) {
      http.makeRequest(
        `collection-point/${pointId}/preload-area`,
        'POST',
        { body: { name: area.name, caps: area.caps, polygon: area.polygon } },
        func
      );
    },
    updatePreloadArea(areaId, area, func) {
      http.makeRequest(
        `collection-point/preload-area/${areaId}`,
        'PUT',
        { body: { name: area.name, caps: area.caps, polygon: area.polygon } },
        func
      );
    },
    deletePreloadArea(areaId, func) {
      http.makeRequest(
        `collection-point/preload-area/${areaId}`,
        'DELETE',
        {},
        func
      );
    },
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'collection-point',
        'GET',
        { params: this.customerId ? { user_id: this.customerId } : {} },
        callback
      ));
    },
    deleteElement(element, func) {
      http.makeRequest(
        `collection-point/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.list = data.collection_points;
      this.ready = true;
    }
  }
});
