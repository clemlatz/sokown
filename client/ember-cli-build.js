'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { setConfig } = require('@warp-drive/build-config/cjs-set-config.cjs');

const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

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

  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
      DEPRECATE_LEGACY_IMPORTS: false,
    },
  });

  return compatBuild(app, buildOnce);
};
