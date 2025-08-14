const requiredRules = [
  (value) => {
    if (value) return true;
    return 'Campo obbligatorio';
  }
];

const arrayRules = [
  (value) => {
    if (value.length > 0) return true;
    return 'Campo obbligatorio';
  }
];

const capRules = [
  ...requiredRules,
  (value) => {
    if (value && value.length === 5) return true;
    return 'Il CAP deve essere di 5 caratteri';
  }
];

const phoneRules = [
  (value) => {
    if (!value || /^\+39\d{10}$/.test(value)) return true;
    return 'Il numero di telefono deve essere nel formato +39XXXXXXXXXX';
  }
];

export default {
  requiredRules,
  arrayRules,
  capRules,
  phoneRules
};
