import convertKilometersToSokownUnits from "./convertKilometersToSokownUnits";

describe('convertKilometersToSokownUnits', () => {
  test('it converts kilometers to sokown units', () => {
    // given
    const kilometers = 1;

    // when
    const sokownUnits = convertKilometersToSokownUnits(kilometers);

    // then
    expect(sokownUnits).toBe(0.00000668458);
  });
});
