// Stati Stripe dell'abbonamento con l'etichetta mostrata e il colore del chip.
const STATUSES = {
  active: { label: 'Attivo', color: 'success' },
  trialing: { label: 'In prova', color: 'success' },
  past_due: { label: 'Pagamento in ritardo', color: 'warning' },
  canceled: { label: 'Annullato', color: 'error' },
  incomplete: { label: 'Incompleto', color: 'warning' },
  none: { label: 'Nessun abbonamento', color: 'grey' }
};

const statusLabel = (status) => STATUSES[status]?.label || status;

const statusColor = (status) => STATUSES[status]?.color || 'grey';

// Importo in centesimi come cifra in euro, es. 4900 -> "49,00 €".
const formatPrice = (cents) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const formatDate = (isoDate) => (isoDate ? new Date(isoDate).toLocaleDateString('it-IT') : '');


export default {
  statusLabel,
  statusColor,
  formatPrice,
  formatDate
};
