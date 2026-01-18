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
  @tracked public mousePosition: Position | null = null;
  @tracked private _showTrajectory: boolean | null = null;

  get showTrajectory(): boolean {
    if (this._showTrajectory !== null) {
      return this._showTrajectory;
    }
    const saved = window.localStorage.getItem('showTrajectory');
    return saved === 'true';
  }

  set showTrajectory(value: boolean) {
    this._showTrajectory = value;
    window.localStorage.setItem('showTrajectory', String(value));
  }

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

  @action
  public handleMouseMove(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();

    // Convert screen coordinates to SVG viewBox coordinates
    const scaleX = this.mapSize / rect.width;
    const scaleY = this.mapSize / rect.height;

    const svgX = (event.clientX - rect.left) * scaleX - this.mapOffset.x;
    const svgY = (event.clientY - rect.top) * scaleY - this.mapOffset.y;

    // Flip Y-axis back (SVG uses inverted Y)
    this.mousePosition = {
      x: svgX,
      y: -svgY,
    };
  }

  @action
  public handleMouseLeave(): void {
    this.mousePosition = null;
  }
}
