const LABELS = {
  Pending: 'In Attesa',
  'In Progress': 'In Consegna',
  'On Board': 'A Bordo',
  Delay: 'Ritardo',
  Completed: 'Completato',
  Anomaly: 'Anomalia',
  Cancelled: 'Cancellato'
};

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
