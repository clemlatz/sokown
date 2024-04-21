import Component from '@glimmer/component';

export default class PositionComponent extends Component {
  format(coordinate: number) {
    const truncatedNumber = Math.trunc(coordinate * 100) / 100;
    return truncatedNumber.toFixed(2);
  }
}
