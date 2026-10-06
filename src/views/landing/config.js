// Lasciare vuoti demoEmail e bookingUrl mantiene il modulo in anteprima:
// prepara un file scaricabile, senza inviare i dati.
// demoEmail apre una bozza nel programma email dell'utente.
// bookingUrl reindirizza i pulsanti demo a una pagina di prenotazione.
// Non inserire chiavi API o altri segreti: il file finisce nel bundle pubblico.
// I campi legal completano solo i dati del titolare: l'informativa richiede
// anche la verifica di fornitori, conservazione, log e trasferimenti.
export const HUBSTRA_CONFIG = {
  demoEmail: '',
  bookingUrl: '',
  legal: {
    company: '',
    address: '',
    vat: '',
    privacyEmail: ''
  }
};
