import { describe, expect, it } from 'vitest';

import validation from '@/utils/validation';


const check = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) return result;
  }
  return true;
};


describe('positiveNumberRules', () => {
  it.each([null, undefined, '', 0, 5, '12.5'])('accetta %s', (value) => {
    expect(check(value, validation.positiveNumberRules)).toBe(true);
  });

  it.each([-1, 'abc'])('rifiuta %s', (value) => {
    expect(check(value, validation.positiveNumberRules)).toBe('Deve essere un numero positivo');
  });
});


describe('nonNegativeIntegerRules', () => {
  it.each([null, undefined, '', 0, 5, '12'])('accetta %s', (value) => {
    expect(check(value, validation.nonNegativeIntegerRules)).toBe(true);
  });

  it.each([-1, 1.5, '1.5', 'abc'])('rifiuta %s', (value) => {
    expect(check(value, validation.nonNegativeIntegerRules)).toBe(
      'Deve essere un numero intero maggiore o uguale a zero'
    );
  });
});


describe('requiredRules', () => {
  it('accetta un valore valorizzato', () => {
    expect(check('Mario', validation.requiredRules)).toBe(true);
  });

  it.each(['', null, undefined, 0])('rifiuta %s', (value) => {
    expect(check(value, validation.requiredRules)).toBe('Campo obbligatorio');
  });
});


describe('requiredRulesWithZero', () => {
  it('accetta lo zero, a differenza di requiredRules', () => {
    expect(check(0, validation.requiredRulesWithZero)).toBe(true);
    expect(check(0, validation.requiredRules)).toBe('Campo obbligatorio');
  });

  it('accetta anche lo zero scritto come stringa', () => {
    expect(check('0', validation.requiredRulesWithZero)).toBe(true);
  });

  it('rifiuta un valore non numerico', () => {
    expect(check(NaN, validation.requiredRulesWithZero)).toBe('Campo obbligatorio');
  });

  it.each(['', null, undefined])('rifiuta %s', (value) => {
    expect(check(value, validation.requiredRulesWithZero)).toBe('Campo obbligatorio');
  });
});


describe('arrayRules', () => {
  it('accetta una lista con elementi', () => {
    expect(check([1], validation.arrayRules)).toBe(true);
  });

  it('rifiuta una lista vuota', () => {
    expect(check([], validation.arrayRules)).toBe('Campo obbligatorio');
  });
});


describe('capRules', () => {
  it('accetta un cap di cinque cifre', () => {
    expect(check('70020', validation.capRules)).toBe(true);
  });

  it('rifiuta un cap vuoto', () => {
    expect(check('', validation.capRules)).toBe('Campo obbligatorio');
  });

  it.each(['700', '700200'])('rifiuta il cap %s', (cap) => {
    expect(check(cap, validation.capRules)).toBe('Il CAP deve essere di 5 caratteri');
  });
});


describe('phoneRules', () => {
  it('accetta il formato internazionale', () => {
    expect(check('+393331112222', validation.phoneRules)).toBe(true);
  });

  it('accetta il campo vuoto: il telefono non e obbligatorio', () => {
    expect(check('', validation.phoneRules)).toBe(true);
  });

  it.each(['3331112222', '+39333111222', '+39 333 111 2222'])('rifiuta %s', (phone) => {
    expect(check(phone, validation.phoneRules)).toBe(
      'Il numero di telefono deve essere nel formato +39XXXXXXXXXX'
    );
  });
});


describe('futureTime', () => {
  it('accetta un orario di fine successivo a quello di inizio', () => {
    expect(check('10:30', validation.futureTime('08:00'))).toBe(true);
  });

  it.each(['08:00', '07:30'])('rifiuta l-orario %s rispetto alle 08:00', (value) => {
    expect(check(value, validation.futureTime('08:00'))).toBe(
      'L\'orario di fine deve essere maggiore di quello di inizio'
    );
  });

  it('resta obbligatorio', () => {
    expect(check('', validation.futureTime('08:00'))).toBe('Campo obbligatorio');
  });

  it('non confronta nulla senza orario di inizio', () => {
    expect(check('10:30', validation.futureTime(null))).toBe(true);
  });
});


describe('futureDate', () => {
  it('accetta una data successiva a quella iniziale', () => {
    expect(check('2026-09-02', validation.futureDate('2026-09-01'))).toBe(true);
  });

  it('rifiuta una data precedente o uguale', () => {
    expect(check('2026-08-31', validation.futureDate('2026-09-01'))).toBe(
      'La data deve essere successiva a quella iniziale'
    );
  });

  it('chiede prima la data iniziale', () => {
    expect(check('2026-09-02', validation.futureDate(''))).toBe('Inserisci prima la data iniziale');
  });
});


describe('regole sulla dimensione dei gruppi', () => {
  it('accetta un minimo non superiore al massimo', () => {
    expect(check(3, validation.minGroupSizeRule(5))).toBe(true);
    expect(check(5, validation.maxGroupSizeRule(3))).toBe(true);
  });

  it('rifiuta un minimo maggiore del massimo', () => {
    expect(check(7, validation.minGroupSizeRule(5))).toBe(
      'La dimensione minima del gruppo non può essere maggiore della massima'
    );
  });

  it('rifiuta un massimo minore del minimo', () => {
    expect(check(2, validation.maxGroupSizeRule(5))).toBe(
      'La dimensione massima del gruppo non può essere minore della minima'
    );
  });

  it.each([null, undefined, ''])('non confronta nulla quando il valore e %s', (value) => {
    expect(check(value, validation.minGroupSizeRule(5))).toBe(true);
    expect(check(value, validation.maxGroupSizeRule(5))).toBe(true);
  });

  it.each([null, undefined, ''])('non confronta nulla quando l-altro estremo e %s', (other) => {
    expect(check(3, validation.minGroupSizeRule(other))).toBe(true);
    expect(check(3, validation.maxGroupSizeRule(other))).toBe(true);
  });
});
