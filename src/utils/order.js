// Property icon is used in @/views/OrderStatus
const LABELS = [
  {
    value: 'New',
    title: 'Nuovo',
    icon: 'mdi-timer-sand'
  },
  {
    value: 'Confirmed',
    title: 'Confermato',
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
