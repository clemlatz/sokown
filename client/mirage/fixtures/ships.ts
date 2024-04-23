export default [
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
    destinationPosition: { x: 3, y: 4 },
    destinationLocation: { name: 'Moon' },
    timeToDestination: 312,
  },
];
