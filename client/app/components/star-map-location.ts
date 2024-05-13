// noinspection JSUnusedGlobalSymbols

import Component from '@glimmer/component';

import type { Position } from 'sokown-client/types';
import type Location from 'sokown-client/models/location';

interface ComponentSignature {
  Args: {
    label: string;
    color: string;
    location: Location;
    position: Position;
    primaryBodyPosition: Position | null;
    distanceFromPrimaryBody: number;
    scale: number;
  };
}

export default class StarMapLocationComponent extends Component<ComponentSignature> {
  get shouldBeDisplayed(): boolean {
    return (
      this.primaryBodyPosition === null ||
      this.orbitRadius > (this.args.scale / 10) * 3
    );
  }

  get objectPosition(): Position {
    return {
      x: this.args.position.x,
      y: -this.args.position.y,
    };
  }

  get labelPositionY(): number {
    return this.objectPosition.y + (this.args.scale / 10) * 3.5;
  }

  get primaryBodyPosition(): Position | null {
    if (!this.args.primaryBodyPosition) {
      return null;
    }

    return {
      x: this.args.primaryBodyPosition.x,
      y: -this.args.primaryBodyPosition.y,
    };
  }

  get orbitLabel(): string {
    return `${this.args.label}'s orbit`;
  }

  get orbitRadius(): number {
    return this.args.distanceFromPrimaryBody;
  }

  get fillColor(): string {
    return this.primaryBodyPosition === null
      ? this.args.color
      : 'url(#gradient)';
  }

  get transformOrigin(): string {
    return `${this.objectPosition.x} ${this.objectPosition.y}`;
  }

  get angleToTheSun(): string {
    const angleInRadians = Math.atan2(
      this.objectPosition.y,
      this.objectPosition.x,
    );
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
    const angleFromPositiveYAxis = angleInDegrees - 90;
    return `rotate(${angleFromPositiveYAxis})`;
  }
}
