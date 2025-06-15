// Serve and test script for Playwright
// Usage: node serve-and-test.js

const { execSync, spawn } = require('child_process'); // Modified this line

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

// Build the application first
try {
  console.log('Building the application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build successful.');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Start the server (suppress stdout/stderr)
const server = spawn('npx', ['serve', '.', '-l', PORT], {
  stdio: ['ignore', 'ignore', 'ignore'],
  shell: true,
});

// Wait for the server to be ready
const waitOn = require('wait-on');
waitOn({ resources: [BASE_URL], timeout: 15000 })
  .then(() => {
    // Generate BDD test files, then run Playwright tests
    const bddgen = spawn('npx', ['bddgen'], {
      env: { ...process.env, BASE_URL },
      stdio: 'inherit',
      shell: true,
    });
    bddgen.on('exit', bddCode => {
      if (bddCode !== 0) {
        console.log('bddgen failed.');
        server.kill();
        process.exit(bddCode);
        return;
      }
      const test = spawn('npx', ['playwright', 'test'], {
        env: { ...process.env, BASE_URL },
        stdio: 'inherit',
        shell: true,
      });
      test.on('exit', code => {
        console.log(`\nPlaywright tests exited with code ${code}`);
        if (code === 0) {
          console.log('All tests passed.');
        } else {
          console.log('Some tests failed. See output above.');
        }
        server.kill();
        // Optionally, print report location
        console.log('\nPlaywright HTML report (if generated) is in ./playwright-report/index.html');
        process.exit(code);
      });
    });
  })
  .catch(err => {
    console.error('Server did not start in time:', err);
    server.kill();
    process.exit(1);
  });
