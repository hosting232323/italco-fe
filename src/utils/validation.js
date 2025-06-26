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
  (value) => {
    if (value && value.length === 5) return true;
    return 'Il CAP deve essere di 5 caratteri';
  }
];

export default {
  requiredRules,
  arrayRules,
  capRules
};
