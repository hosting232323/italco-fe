const LABELS = [
  { value: 'Pending', title: 'In Attesa' },
  { value: 'In Progress', title: 'In Consegna' },
  { value: 'On Board', title: 'A Bordo' },
  { value: 'At Warehouse', title: 'In Magazzino' },
  { value: 'Completed', title: 'Completato' },
  { value: 'Cancelled', title: 'Non Completato' },
  { value: 'To Reschedule', title: 'Da Riprogrammare' }
];

const TYPES = [
  {
    title: 'Consegna',
    value: 'Delivery'
  },
  {
    title: 'Ritiro',
    value: 'Withdraw'
  },
  {
    title: 'Sostituzione',
    value: 'Replacement'
  },
  {
    title: 'Verifica',
    value: 'CHECK'
  }
];

const formatFilters = (filters) => {
  if (filters['Order.booking_date_0'] && filters['Order.booking_date_1']) {
    filters['Order.booking_date'] = [filters['Order.booking_date_0'], filters['Order.booking_date_1']];
    delete filters['Order.booking_date_0'];
    delete filters['Order.booking_date_1'];
  }

  return Object.keys(filters)
    .filter(key => filters[key] !== null)
    .map(key => {
      return {
        value: filters[key],
        model: key.split('.')[0],
        field: key.split('.')[1]
      };
    });
};

export default {
  LABELS,
  TYPES,
  formatFilters
};
