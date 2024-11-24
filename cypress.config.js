const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
      baseUrl: 'https://demo.opencart.com/en-gb?route=common/home',
      viewportHeight: 720,
      viewportWidth: 1280,
      setupNodeEvents(on, config){
      },
      defaultCommandTimeout: 20000,
    },
});
