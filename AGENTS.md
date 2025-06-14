# Contributor Guidelines

## Running the Test Suite

- Install dependencies with `npm install` if node_modules are missing.
- Run all end-to-end tests with:

```bash
npm run test:e2e
```

This command serves the app locally and executes the Playwright BDD tests. All tests must pass before committing changes.
- To view the generated HTML report after the run, execute:

```bash
npm run report:e2e
```

## Writing Tests

- Feature files belong in `tests/features` and use Gherkin syntax.
- Implement matching steps in `tests/step_definitions` using `playwright-bdd`:

```javascript
import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd();
```

- Each step receives the Playwright `page` via `async ({ page }) => { ... }`.
- Use Node's `assert` module for assertions.

## Tech stack and storage backend
Please see the file: docs/technical-implementation.md
