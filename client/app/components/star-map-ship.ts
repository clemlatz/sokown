// noinspection JSUnusedGlobalSymbols

import Component from '@glimmer/component';

import type { Position } from 'sokown-client/types';
import type ShipModel from 'sokown-client/models/ship';

interface ComponentSignature {
  Args: {
    ship: ShipModel;
    scale: number;
  };
}

export default class StarMapLocationComponent extends Component<ComponentSignature> {
  get objectPosition(): Position {
    return {
      x: this.args.ship.currentPosition.x,
      y: -this.args.ship.currentPosition.y,
    };
  }

  get polygonPoints(): string {
    const leftWingX = this.objectPosition.x + (-1 * this.args.scale) / 10;
    const leftWingY = this.objectPosition.y + (3 * this.args.scale) / 10;

    const rearX = this.objectPosition.x;
    const rearY = this.objectPosition.y + (2 * this.args.scale) / 10;

    const rightWingX = this.objectPosition.x + (1 * this.args.scale) / 10;
    const rightWingY = this.objectPosition.y + (3 * this.args.scale) / 10;

    return `${this.objectPosition.x},${this.objectPosition.y} ${leftWingX},${leftWingY}, ${rearX},${rearY} ${rightWingX},${rightWingY}`;
  }

  get transformOrigin(): string {
    return `${this.objectPosition.x} ${this.objectPosition.y}`;
  }

  get rotation(): string {
    return `rotate(${this.args.ship.currentCourse})`;
  }
}
