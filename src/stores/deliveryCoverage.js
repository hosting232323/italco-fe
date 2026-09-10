import http from '@/utils/http';
import { defineStore } from 'pinia';
import storesUtils from '@/utils/stores';

// Copertura dei corrieri per la pagina a calendario: coperture fisse (finestra
// di date + giorni della settimana con orari) e assenze puntuali. La stessa
// GET porta a casa anche l'elenco degli utenti delivery, così i form non
// devono passare da /user.
export const useDeliveryCoverageStore = defineStore('deliveryCoverage', {
  state: () => ({
    deliveryUsers: [],
    coverages: [],
    absences: [],
    element: {},
    // Copertura di cui si stanno gestendo i giorni della settimana nel popup.
    managedCoverage: null,
    ready: false,
    coverageForm: false,
    absenceForm: false
  }),
  actions: {
    initList() {
      storesUtils.refreshList(this, (callback) => http.makeRequest(
        'delivery-coverage',
        'GET',
        {},
        callback
      ));
    },
    createCoverage(func) {
      http.makeRequest(
        'delivery-coverage',
        'POST',
        { body: this.element },
        func
      );
    },
    updateCoverage(func) {
      http.makeRequest(
        `delivery-coverage/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'days', 'company_id']) },
        func
      );
    },
    deleteCoverage(element, func) {
      http.makeRequest(
        `delivery-coverage/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    createCoverageDay(coverageId, data, func) {
      http.makeRequest(
        `delivery-coverage/${coverageId}/day`,
        'POST',
        { body: data },
        func
      );
    },
    updateCoverageDay(dayId, data, func) {
      http.makeRequest(
        `delivery-coverage/day/${dayId}`,
        'PUT',
        { body: data },
        func
      );
    },
    deleteCoverageDay(dayId, func) {
      http.makeRequest(
        `delivery-coverage/day/${dayId}`,
        'DELETE',
        {},
        func
      );
    },
    createAbsence(func) {
      http.makeRequest(
        'delivery-coverage/absence',
        'POST',
        { body: this.element },
        func
      );
    },
    updateAbsence(func) {
      http.makeRequest(
        `delivery-coverage/absence/${this.element.id}`,
        'PUT',
        { body: storesUtils.exclude_keys(this.element, ['created_at', 'updated_at', 'company_id']) },
        func
      );
    },
    deleteAbsence(element, func) {
      http.makeRequest(
        `delivery-coverage/absence/${element.id}`,
        'DELETE',
        {},
        func
      );
    },
    setList(data) {
      this.deliveryUsers = data.delivery_users;
      this.coverages = data.coverages;
      this.absences = data.absences;
      // Il popup dei giorni tiene un riferimento a una copertura: dopo un
      // refresh va riagganciato alla versione appena arrivata, o mostrerebbe
      // ancora i giorni vecchi.
      if (this.managedCoverage)
        this.managedCoverage = data.coverages.find((coverage) => coverage.id === this.managedCoverage.id) || null;
      this.ready = true;
    }
  }
});
