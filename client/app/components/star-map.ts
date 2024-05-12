// noinspection JSUnusedGlobalSymbols

import Component from '@glimmer/component';

import type Location from 'sokown-client/models/location';
import type ShipModel from 'sokown-client/models/ship';
import type { Position } from 'sokown-client/types';

interface ComponentSignature {
  Args: {
    locations: Location[];
    ship: ShipModel;
    scale: number;
  };
}

export default class StarMapComponent extends Component<ComponentSignature> {
  public get scale(): number {
    return this.args.scale || 300;
  }

  private get mapSize(): number {
    return this.scale * 10;
  }

  private get centerPosition(): Position {
    if (this.args.ship) {
      return {
        x: this.args.ship.currentPosition.x,
        y: -this.args.ship.currentPosition.y,
      };
    }

    return { x: 0, y: 0 };
  }

  private get mapOffset(): Position {
    return {
      x: this.mapSize / 2 - this.centerPosition.x,
      y: this.mapSize / 2 - this.centerPosition.y,
    };
  }

  public get viewBox(): string {
    return `${-this.mapOffset.x} ${-this.mapOffset.y} ${this.mapSize} ${this.mapSize}`;
  }

  public get fontSize(): number {
    return this.scale / 5;
  }
}
