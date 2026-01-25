import { setupMirage as upstreamSetupMirage } from 'ember-mirage/test-support';
import { createServer, Model, JSONAPISerializer } from 'miragejs';

class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attributeKey: string) {
    return attributeKey;
  }
}

const ships = [
  {
    id: 1,
    owner: {
      id: 3,
      pilotName: 'Kathryn D. Sullivan',
    },
    name: 'Artémis',
    speedInKilometersPerSecond: 100,
    currentPosition: { x: 3, y: 4 },
    currentLocation: { name: 'Moon' },
    currentCourse: 0,
    destinationPosition: null,
    destinationLocation: null,
    timeToDestination: null,
  },
  {
    id: 2,
    owner: {
      id: 4,
      pilotName: 'Anna Fisher',
    },
    name: 'Bebop',
    speedInKilometersPerSecond: 100,
    currentPosition: { x: 1, y: 2 },
    currentLocation: { name: 'Earth' },
    currentCourse: 84,
    destinationPosition: { x: 3, y: 4 },
    destinationLocation: { name: 'Moon' },
    timeToDestination: 312,
  },
];

const locations = [
  {
    id: 'earth',
    name: 'Earth',
    position: { x: 1, y: 2 },
  },
  {
    id: 'moon',
    name: 'Moon',
    position: { x: 1, y: 2 },
  },
];

function routes() {
  // @ts-expect-error miragejs types
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

  // @ts-expect-error miragejs types
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

  // @ts-expect-error miragejs types
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

  // @ts-expect-error miragejs types
  this.get('/api/ships'); // eslint-disable-line ember/no-get

  // @ts-expect-error miragejs types
  this.get('/api/ships/:id'); // eslint-disable-line ember/no-get

  // @ts-expect-error miragejs types
  this.patch('/api/ships/:id');

  // @ts-expect-error miragejs types
  this.get('/api/locations'); // eslint-disable-line ember/no-get

  // @ts-expect-error miragejs types
  this.get('/api/locations/:id'); // eslint-disable-line ember/no-get

  // @ts-expect-error miragejs types
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

function makeServer(config = {}) {
  return createServer({
    ...config,
    models: {
      ship: Model.extend({}),
      location: Model.extend({}),
      user: Model.extend({}),
      authenticationMethod: Model.extend({}),
    },
    serializers: {
      application: ApplicationSerializer,
    },
    fixtures: {
      ships,
      locations,
    },
    routes,
  });
}

export function setupMirage(hooks: NestedHooks) {
  upstreamSetupMirage(hooks, { createServer: makeServer });
}
