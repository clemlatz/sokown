import Component from '@glimmer/component';

export default class PositionComponent extends Component {
  format(coordinate) {
    const truncatedNumber = Math.trunc(coordinate * 1000) / 1000;
    return truncatedNumber.toFixed(3);
  }
}
