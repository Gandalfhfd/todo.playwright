import { defineConfig, devices } from '@playwright/test';
import { AzureReporterOptions } from '@alex_neo/playwright-azure-reporter/dist/playwright-azure-reporter';


/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['json', {outputFile: './results.json'}]],
  // reporter: [
  //   ['list'],
  //   [
  //     '@alex_neo/playwright-azure-reporter',
  //     {
  //       orgUrl: 'https://dev.azure.com/nfocus/',
  //       token: process.env.ADO_PAT,
  //       planId: 6737,
  //       projectName: 'TODO%20Intake%204',
  //       publishTestResultsMode: 'testRun',
  //       uploadAttachments: true,
  //       attachmentsType: ['screenshot', 'video', 'trace'],
  //       testRunConfig: {
  //         owner: {
  //           displayName: 'Intake 4',
  //         },
  //         comment: 'Playwright Test Run',
  //         // the configuration ids of this test run, use 
  //         // https://dev.azure.com/{organization}/{project}/_apis/test/configurations to get the ids of  your project.
  //         // if multiple configuration ids are used in one run a testPointMapper should be used to pick the correct one, 
  //         // otherwise the results are pushed to all.
  //         configurationIds: [ 143 ],
  //       },
  //     } as AzureReporterOptions,
  //   ],
  // ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
