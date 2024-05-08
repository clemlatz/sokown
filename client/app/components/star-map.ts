// noinspection JSUnusedGlobalSymbols

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { Position } from 'sokown-client/types';
import type Location from 'sokown-client/models/location';

interface ComponentSignature {
  Args: {
    location: Location;
    position: Position;
    scale: number;
  };
}

export default class StarMapComponent extends Component<ComponentSignature> {
  @tracked scale: number = 300;
}
