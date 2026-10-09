// Writes N identical test files. Each one mocks `src/answer.js` and checks
// that it got the mock. More files give the race more chances to show.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const count = Number(process.argv[2] ?? 100);
rmSync('test', { recursive: true, force: true });
mkdirSync('test');

const source = `import { expect, test, vi } from 'vitest';
import { getAnswer } from '../src/answer.js';

vi.mock('../src/answer.js', () => ({ getAnswer: () => 'mocked' }));

test('the module mock applies', () => {
  expect(getAnswer()).toBe('mocked');
});
`;

for (let i = 1; i <= count; i++) {
  writeFileSync(`test/mock-${String(i).padStart(3, '0')}.test.js`, source);
}
console.log(`Wrote ${count} test files.`);
