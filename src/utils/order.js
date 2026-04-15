// Property icon is used in @/views/OrderStatus
const LABELS = [
  {
    value: 'Acquired',
    title: 'Acquisito',
    icon: 'mdi-timer-sand'
  },
  {
    value: 'Booked',
    title: 'Booked',
    color: 'blue',
    icon: 'mdi-calendar-check'
  },
  {
    value: 'Scheduled',
    title: 'In Bdx',
    color: 'blue',
    icon: 'mdi-progress-clock'
  },
  {
    value: 'Booking',
    title: 'A Bordo',
    color: 'blue',
    icon: 'mdi-truck-delivery'
  },
  {
    value: 'At Warehouse',
    title: 'In Magazzino',
    color: 'orange'
  },
  {
    value: 'Delivered',
    title: 'Completato',
    color: 'green',
    icon: 'mdi-check-circle-outline'
  },
  {
    value: 'Not Delivered',
    title: 'Non Completato',
    color: 'red'
  },
  {
    value: 'To Reschedule',
    title: 'Da Riprogrammare',
    color: 'orange'
  },
  {
    value: 'Redelivery',
    title: 'Riprogrammato',
    color: 'green'
  },
  { 
    value: 'Replacement',
    title: 'Sostituzione',
    color: 'purple'
  },
  { 
    value: 'Cancelled', 
    title: 'Annullato', 
    color: 'red' 
  },
  { 
    value: 'Urgent', 
    title: 'Urgente', 
    color: 'red' 
  },
  { 
    value: 'Verification', 
    title: 'In Verifica', 
    color: 'yellow' 
  },
  { 
    value: 'Cancelled to be Refunded', 
    title: 'Annullato da rimborsare', 
    color: 'red' 
  },
  { 
    value: 'Deleted', 
    title: 'Eliminato', 
    color: 'grey' 
  }
];

const EXTERNAL_LABELS = [
  {
    value: 'New',
    title: 'Nuovo',
    color: 'grey'
  },
  {
    value: 'Confirmed',
    title: 'Confermato',
    color: 'blue'
  },
  {
    value: 'Booking',
    title: 'A Bordo',
    color: 'blue'
  },
  {
    value: 'At Warehouse',
    title: 'In Magazzino',
    color: 'orange'
  },
  {
    value: 'Delivered',
    title: 'Completato',
    color: 'green'
  },
  {
    value: 'Not Delivered',
    title: 'Non Completato',
    color: 'red'
  },
  {
    value: 'To Reschedule',
    title: 'Da Riprogrammare',
    color: 'yellow'
  },
  {
    value: 'Redelivery',
    title: 'Riprogrammato',
    color: 'green'
  },
  { 
    value: 'Replacement',
    title: 'Sostituzione',
    color: 'purple'
  },
  { 
    value: 'Cancelled', 
    title: 'Annullato', 
    color: 'red' 
  },
  { 
    value: 'Urgent', 
    title: 'Urgente', 
    color: 'red' 
  },
  { 
    value: 'Verification', 
    title: 'In Verifica', 
    color: 'pink' 
  },
  { 
    value: 'Cancelled to be Refunded', 
    title: 'Annullato da rimborsare', 
    color: 'red' 
  },
  { 
    value: 'Deleted', 
    title: 'Eliminato', 
    color: 'grey' 
  }
];

const RAE_STATUS = [
  {
    value: 'Generated',
    title: 'Generato'
  },
  {
    value: 'Emitted',
    title: 'Emesso',
    color: 'blue'
  },
  {
    value: 'LDR',
    title: 'LDR',
    color: 'blue'
  },
  {
    value: 'Disposed Off',
    title: 'Smaltito',
    color: 'green'
  },
  {
    value: 'Annulled',
    title: 'Annullato',
    color: 'red'
  }
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
    value: 'Check'
  }
];

export default {
  LABELS,
  EXTERNAL_LABELS,
  TYPES,
  RAE_STATUS
};
