// Stati Stripe dell'abbonamento con l'etichetta mostrata e il colore del chip.
const STATUSES = {
  active: { label: 'Attivo', color: 'success' },
  trialing: { label: 'In prova', color: 'success' },
  past_due: { label: 'Pagamento in ritardo', color: 'warning' },
  canceled: { label: 'Annullato', color: 'error' },
  incomplete: { label: 'Incompleto', color: 'warning' },
  none: { label: 'Nessun abbonamento', color: 'grey' }
};

// Stati delle fatture Stripe: paid = saldata, open = emessa e non ancora pagata,
// uncollectible = Stripe ha rinunciato a incassarla, void = annullata.
const INVOICE_STATUSES = {
  paid: { label: 'Saldata', color: 'success' },
  open: { label: 'Da pagare', color: 'warning' },
  uncollectible: { label: 'Non riscossa', color: 'error' },
  void: { label: 'Annullata', color: 'grey' }
};

const statusLabel = (status) => STATUSES[status]?.label || status;

const statusColor = (status) => STATUSES[status]?.color || 'grey';

const invoiceStatusLabel = (status) => INVOICE_STATUSES[status]?.label || status;

const invoiceStatusColor = (status) => INVOICE_STATUSES[status]?.color || 'grey';

// Importo in centesimi come cifra in euro, es. 4900 -> "49,00 €".
const formatPrice = (cents) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);

const formatDate = (isoDate) => (isoDate ? new Date(isoDate).toLocaleDateString('it-IT') : '');


export default {
  statusLabel,
  statusColor,
  invoiceStatusLabel,
  invoiceStatusColor,
  formatPrice,
  formatDate
};
