import { discoverEmberDataModels } from 'ember-cli-mirage';
import { createServer } from 'miragejs';

export default function (config) {
  let finalConfig = {
    ...config,
    // Remove discoverEmberDataModels if you do not want ember-cli-mirage to auto discover the ember models
    models: {
      ...discoverEmberDataModels(config.store),
      ...config.models,
    },

    // uncomment to opt into ember-cli-mirage to auto discover ember serializers
    // serializers: applyEmberDataSerializers(config.serializers),
    routes,
  };

  return createServer(finalConfig);
}

function routes() {
  this.get('/api/users/me', () => {
    return {
      data: {
        id: 'me',
        type: 'user',
        attributes: {
          pilotName: 'Amy Johnson',
        },
      },
    };
  });

  this.post('/api/users', () => {
    return {
      data: {
        id: 'me',
        type: 'user',
        attributes: {
          pilotName: 'Amy Johnson',
        },
      },
    };
  });

  this.get('/api/authentication-methods/current', () => {
    return {
      data: {
        id: 'current',
        type: 'authenticationMethod',
        attributes: {
          idTokenClaims: {
            sub: 1,
            email: 'amy.johnson@example.net',
            username: 'Amy Johnson',
          },
        },
      },
    };
  });

  this.get('/api/ships');

  this.get('/api/ships/:id');

  this.patch('/api/ships/:id');

  this.get('/api/locations');

  this.get('/api/locations/:id');

  this.get('/api/locations/:id/position', () => {
    return {
      data: {
        id: 'moon',
        type: 'position',
        attributes: { x: 1, y: 2 },
      },
    };
  });
}
