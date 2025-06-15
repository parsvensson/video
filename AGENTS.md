# Contributor Guidelines

## Setting up and Running the Application

This project now uses a build step to bundle JavaScript modules.

1.  **Install Dependencies:** If you haven't already, install the necessary Node.js packages:
    ```bash
    npm install
    ```
2.  **Build the Application:** Before running the application or tests, you need to build the JavaScript bundle:
    ```bash
    npm run build
    ```
    This will create a `dist/bundle.js` file.
3.  **Running Locally (for development):**
    To automatically rebuild the bundle when you make changes to JavaScript files, use the watch command in one terminal:
    ```bash
    npm run watch
    ```
    Then, open `index.html` in your browser to view the application.
    The application expects Supabase environment variables (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) to be available on the `window` object for local development, as currently set in `index.html`.

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
