const LABELS = {
  Pending: 'In Attesa',
  'In Progress': 'In Consegna',
  Delay: 'Ritardo',
  Completed: 'Completed',
  Anomaly: 'Anomaly',
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


export default {
  LABELS,
  TYPES
};
