const report = require("multiple-cucumber-html-reporter");
const pkg = require('../../package.json'); // předpokládáme, že package.json obsahuje metadata o projektu

report.generate({
  jsonDir: "test-results",
  reportPath: "./reports",
  reportName: `Test Report - ${new Date().toLocaleString()}`,
  pageTitle: `Test Report - ${pkg.name}`,
  displayDuration: true,
  openReportInBrowser: true,
  metadata: {
    browser: {
      name: "chrome",
      version: "latest",
    },
    device: process.env.USERNAME || "Local Test Machine",
    platform: {
      name: process.platform,
      version: process.version,
    },
  },
  customData: {
    title: 'Run info',
    data: [
      { label: 'Project', value: pkg.name },
      { label: 'Release', value: pkg.version },
      { label: 'Cycle', value: process.env.CYCLE || 'Full Regression' },
      // Přidat další data dle potřeby
    ],
  },
});