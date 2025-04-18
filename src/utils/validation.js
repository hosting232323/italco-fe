const requiredRules = [
  (value) => {
    if (value) return true;
    return 'Campo obbligatorio';
  }
];

const emailRules = requiredRules.concat([
  (value) => {
    if (/.+@.+\..+/.test(value)) return true;
    return 'E-mail non valida.';
  }
]);

const siteRules = requiredRules.concat([
  (value) => {
    if (/^(https?:\/\/)?([\w-]+\.)+([a-z]{2,})+(\/[\w-]*)*(\?[a-z0-9-]+=[a-z0-9-%]+(&[a-z0-9-]+=[a-z0-9-%]+)*)?$/i.test(value))
      return true;
    return 'Sito non valido.';
  }
]);

const passwordRules = requiredRules.concat([
  (value) => {
    if (/[A-Z]/.test(value)) return true;
    return 'La password deve contenere almeno una lettera maiscola.';
  },
  (value) => {
    if (/[a-z]/.test(value)) return true;
    return 'La password deve contenere almeno una lettera minuscola.';
  },
  (value) => {
    if (/\d/.test(value)) return true;
    return 'La password deve contenere almeno un numero.';
  },
  (value) => {
    if (value.length >= 8) return true;
    return 'La password deve contenere almeno 8 caratteri.';
  }
]);

const validateInput = (value, rules) => {
  const errors = [];
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) errors.push(result);
  }
  return errors.length === 0 ? null : errors;
}

export default {
  validateInput,
  requiredRules,
  emailRules,
  siteRules,
  passwordRules
};
