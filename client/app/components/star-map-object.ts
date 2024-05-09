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

export default class StarMapObjectComponent extends Component<ComponentSignature> {
  get shouldBeDisplayed(): boolean {
    return this.primaryBodyPosition === null || this.orbitRadius > 5;
  }

  get objectPosition(): Position {
    return {
      x: (this.args.position.x / this.starMapSizeInSokownUnits) * 100,
      y: (-this.args.position.y / this.starMapSizeInSokownUnits) * 100,
    };
  }

  get labelPosition(): Position {
    return {
      x: this.objectPosition.x,
      y: this.objectPosition.y + 3.5,
    };
  }

  get primaryBodyPosition(): Position | null {
    if (!this.args.primaryBodyPosition) {
      return null;
    }

    return {
      x:
        (this.args.primaryBodyPosition.x / this.starMapSizeInSokownUnits) * 100,
      y:
        (-this.args.primaryBodyPosition.y / this.starMapSizeInSokownUnits) *
        100,
    };
  }

  get orbitLabel(): string {
    return `${this.args.label}'s orbit`;
  }

  get orbitRadius(): number {
    return (
      (this.args.distanceFromPrimaryBody / this.starMapSizeInSokownUnits) * 100
    );
  }

  private get starMapSizeInSokownUnits() {
    return this.args.scale * 10;
  }
}
