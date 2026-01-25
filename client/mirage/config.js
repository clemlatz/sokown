import { createServer } from 'miragejs';
import ship from './models/ship';
import location from './models/location';
import user from './models/user';
import authenticationMethod from './models/authentication-method';

export default function (config) {
  let finalConfig = {
    ...config,
    models: {
      ship,
      location,
      user,
      authenticationMethod,
      ...config.models,
    },
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
