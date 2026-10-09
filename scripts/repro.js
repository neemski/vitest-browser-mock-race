// Runs the suite several times and counts the test files whose mock did not
// apply. Usage: node scripts/repro.js [runs]
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const runs = Number(process.argv[2] ?? 10);
const outputFile = '.vitest/results.json';
let failed = 0;
let total = 0;

for (let run = 1; run <= runs; run++) {
  spawnSync(
    'npx',
    ['vitest', 'run', '--reporter=json', `--outputFile=${outputFile}`, ...process.argv.slice(3)],
    { stdio: 'ignore' }
  );
  const { testResults } = JSON.parse(readFileSync(outputFile, 'utf8'));
  const failedFiles = testResults.filter((file) => file.status === 'failed');
  failed += failedFiles.length;
  total += testResults.length;
  const names = failedFiles.map((file) => file.name.split('/').pop()).join(', ');
  console.log(`run ${run}: ${failedFiles.length} of ${testResults.length} files failed ${names}`);
}

console.log(`\nThe mock did not apply in ${failed} of ${total} test files.`);
