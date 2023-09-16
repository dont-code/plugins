const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/plugin-tester-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/plugin-tester-e2e/screenshots',
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,
  e2e: {
    setupNodeEvents(on, config) {
      on ('before:browser:launch', (browser={}, launchOptions) => {
/*        if ((browser.family ==='chromium') && (browser.name !== 'electron')) {
          launchOptions.args.push('--enable-logging=stderr');
          launchOptions.args.push('--v=10');
          console.log("Running Browser "+browser.family+ " with args "+launchOptions.args);
        } else if (browser.name==='electron') {
            // launchOptions.env doesn't work with electron
          launchOptions.env.ELECTRON_ENABLE_LOGGING='true';
          launchOptions.env.DEBUG='cypress:electron';
        }*/
        return launchOptions;
      })
    },
    specPattern: './src/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
})
