// Le richieste demo partono dal modulo verso il backend (POST /demo-request);
// i destinatari si configurano lato server con DEMO_REQUEST_EMAILS.
// bookingUrl, se valorizzato, reindirizza invece i pulsanti demo a una pagina
// di prenotazione esterna e il modulo non si apre.
// Non inserire chiavi API o altri segreti: il file finisce nel bundle pubblico.
// I campi legal completano solo i dati del titolare: l'informativa richiede
// anche la verifica di fornitori, conservazione, log e trasferimenti.
export const HUBSTRA_CONFIG = {
  bookingUrl: '',
  legal: {
    company: '',
    address: '',
    vat: '',
    privacyEmail: ''
  }
};
