import { helper } from '@ember/component/helper';

export function formatCoordinate([coordinate]: [number]): string {
  const truncatedNumber = Math.trunc(coordinate * 1000) / 1000;
  return truncatedNumber.toFixed(3);
}

export default helper(formatCoordinate);
