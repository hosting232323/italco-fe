// Il cookie di refresh e' HttpOnly e SameSite=Strict: il browser lo manda al
// backend solo se la pagina sta sullo stesso sito dell'API. Il frontend pero'
// risponde anche sul dominio vecchio (ares-logistics.it) mentre l'API e' su
// hubstra.it: da li' il rinnovo al ricaricamento fallisce sempre e l'utente si
// ritrova con «sessione scaduta». Si porta la pagina sul sito dell'API.

// Sito (dominio registrabile) di un host: le ultime due etichette bastano per i
// domini .it e .com in uso. localhost e gli indirizzi IP restano come sono.
const siteOf = (hostname) => {
  if (!hostname || !hostname.includes('.') || /^[\d.]+$/.test(hostname) || hostname.includes(':'))
    return hostname;
  return hostname.split('.').slice(-2).join('.');
};

// Indirizzo della stessa pagina sul sito dell'API, oppure null se la pagina e'
// gia' li' o se l'API non ha un indirizzo assoluto (es. '/api/').
const sameSiteUrl = (location, apiBase) => {
  let api;
  try {
    api = new URL(apiBase);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(api.protocol))
    return null;
  if (siteOf(location.hostname) === siteOf(api.hostname))
    return null;
  return `${api.origin}${location.pathname}${location.search}${location.hash}`;
};


export default {
  siteOf,
  sameSiteUrl
};
