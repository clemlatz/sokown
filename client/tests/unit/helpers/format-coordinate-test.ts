import { module, test } from 'qunit';
import { formatCoordinate } from 'sokown-client/helpers/format-coordinate';

module('Unit | Helper | format-coordinate', function () {
  test('it formats positive numbers with 3 decimal places', function (assert) {
    assert.strictEqual(formatCoordinate([123.456789]), '123.456');
  });

  test('it formats negative numbers with 3 decimal places', function (assert) {
    assert.strictEqual(formatCoordinate([-45.678901]), '-45.678');
  });

  test('it truncates rather than rounds', function (assert) {
    assert.strictEqual(formatCoordinate([1.9999]), '1.999');
    assert.strictEqual(formatCoordinate([-1.9999]), '-1.999');
  });

  test('it pads numbers with fewer decimal places', function (assert) {
    assert.strictEqual(formatCoordinate([42]), '42.000');
    assert.strictEqual(formatCoordinate([3.1]), '3.100');
  });

  test('it handles zero', function (assert) {
    assert.strictEqual(formatCoordinate([0]), '0.000');
  });
});
