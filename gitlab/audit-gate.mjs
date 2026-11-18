// Esito di deps_check: legge il report di `npm audit --json` e fallisce se
// resta una advisory high/critical non nella lista di quelle accettate.
import { readFileSync } from 'node:fs';

// braces <=3.0.3 (ReDoS su pattern annidati): nessuna versione corretta,
// arriva solo da unplugin-fonts -> fast-glob -> micromatch, cioe' dal build.
// Da togliere appena braces pubblica un fix.
//
// picomatch <=4.0.7 (ReDoS su extglob ripetuti): la 4.0.7 e' l'ultima uscita e
// ricade ancora nel range, nessun fix pubblicato. Arriva solo dal tooling di
// build/test (vite, vitest, unplugin). Da togliere appena esce un fix.
const ACCEPTED = ['GHSA-vfj7-8cjw-p6xm', 'GHSA-fc5q-39xc-vjpf'];

const report = JSON.parse(readFileSync('npm-audit-report.json', 'utf8'));
const advisories = Object.values(report.vulnerabilities ?? {})
  .flatMap(vuln => vuln.via)
  .filter(via => typeof via === 'object' && ['high', 'critical'].includes(via.severity));

const blocking = advisories.filter(via => !ACCEPTED.some(id => via.url.endsWith(id)));
for (const via of blocking) {
  console.error(`${via.severity}: ${via.name} - ${via.title} (${via.url})`);
}
process.exit(blocking.length ? 1 : 0);
