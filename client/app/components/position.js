import Component from '@glimmer/component';

export default class PositionComponent extends Component {
  format(coordinate) {
    return Math.trunc(coordinate * 1000) / 1000;
  }
}
