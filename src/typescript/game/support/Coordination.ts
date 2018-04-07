export class Vector {
  x: number;
  y: number;

  public static zero =  {x: 0, y: 0};
}

export type Size = {
  width: number,
  height: number,
}
export type Rectangle = {
  origin: Vector,
  size: Size,
}

/**
 * @return absolute center position
 */
export type absC = (o: Vector, v: Vector, s: Size) => Vector;
export const absC: absC = (origin: Vector, vector: Vector, size: Size) => ({
  x: origin.x + vector.x + size.width / 2,
  y: origin.y + vector.y + size.height / 2,
});

export type oAbsC = (o: Vector) => Vector;
export const getOAbsC: (defO: Vector) => oAbsC =
  (defaultOrigin: Vector) =>
    (zeroBaseOrigin: Vector) =>
      absC(defaultOrigin, zeroBaseOrigin, {width: 0, height: 0});

// noinspection JSSuspiciousNameCombination
export const aVec = (v: Vector) => ({x: Math.abs(v.x), y: Math.abs(v.y)});
export const rVecX = (v: Vector) => ({x: -v.x, y: v.y});
export const rVecY = (v: Vector) => ({x: v.x, y: -v.y});

// size
export const sizeEq = (n: number): Size => ({width: n, height: n});