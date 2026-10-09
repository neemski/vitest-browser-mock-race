# Browser mode: `vi.mock` sometimes does not apply

With `@vitest/browser-playwright`, a `vi.mock` in a test file sometimes does not
apply. The test gets the real module, and Vitest reports no error.

## Reproduce

```sh
npm ci
npx playwright install chromium
npm run generate        # writes 100 identical test files to test/
npm run repro           # runs the suite 10 times and counts failed files
```

Each test file mocks `src/answer.js` and expects the mock:

```js
import { expect, test, vi } from 'vitest';
import { getAnswer } from '../src/answer.js';

vi.mock('../src/answer.js', () => ({ getAnswer: () => 'mocked' }));

test('the module mock applies', () => {
  expect(getAnswer()).toBe('mocked');
});
```

**Expected:** every file passes.

**Actual:** about 0.6% of files fail with
`AssertionError: expected 'real' to be 'mocked'`.

## Control

`vitest.keep-interception.config.js` is the same config plus one no-op
`context.route()` per page, so request interception stays on for the whole
session. With it, every mock applies:

```sh
npm run repro -- 10 --config=vitest.keep-interception.config.js
```

## Results

| Config | Test files | Mock did not apply |
|---|---|---|
| `vitest.config.js` | 3,000 | 19 |
| `vitest.keep-interception.config.js` | 2,000 | 0 |

The GitHub Actions workflow in `.github/workflows/repro.yml` runs both on
`ubuntu-latest`.
