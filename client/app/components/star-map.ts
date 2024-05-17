// noinspection JSUnusedGlobalSymbols

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import type Location from 'sokown-client/models/location';
import type ShipModel from 'sokown-client/models/ship';
import type { Position } from 'sokown-client/types';

interface ComponentSignature {
  Args: {
    locations: Location[];
    ship: ShipModel;
    scale: number;
    key: 'locations' | 'ship';
  };
}

type SavedZoomLevels = {
  locations: number;
  ship: number;
};

const DEFAULT_SCALE = 256;

export default class StarMapComponent extends Component<ComponentSignature> {
  @tracked private _scale: number | null = null;

  public get scale(): number {
    return (
      this._scale || this.savedZoomLevel || this.args.scale || DEFAULT_SCALE
    );
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

  @action
  public zoomIn(): void {
    const nextScale = this.scale / 2;
    const newScale = nextScale >= 1 ? nextScale : 1;
    this.saveZoomLevel(newScale);
    this._scale = newScale;
  }

  @action
  public zoomOut(): void {
    const nextScale = this.scale * 2;
    const newScale = nextScale <= 1024 ? nextScale : 1024;
    this.saveZoomLevel(newScale);
    this._scale = newScale;
  }

  public saveZoomLevel(scale: number): void {
    const savedZoomLevels = this._readSavedZoomLevels();
    savedZoomLevels[this.args.key] = scale;
    console.log(JSON.stringify(savedZoomLevels));
    window.localStorage.setItem('zoomLevels', JSON.stringify(savedZoomLevels));
  }

  public get savedZoomLevel(): number | null {
    const savedZoomLevels = this._readSavedZoomLevels();
    return savedZoomLevels[this.args.key];
  }

  private _readSavedZoomLevels(): SavedZoomLevels {
    const rawSavedZoomLevels = window.localStorage.getItem('zoomLevels');
    return rawSavedZoomLevels ? JSON.parse(rawSavedZoomLevels) : {};
  }
}
