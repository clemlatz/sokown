'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    autoImport: {
      allowAppImports: ['@ember/test-helpers'],
      packageRules: [
        {
          package: '@1024pix/ember-testing-library',
          addonModules: {
            '@ember/test-helpers': 'default',
          },
        },
      ],
    },
  });

  return app.toTree();
};
