// http://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// noinspection ES6UnusedImports
import * as Matter from 'matter-js'

declare module "matter-js" {
  export function use(...names: string[]): void;

  export interface IBodyDefinition {
    plugin?: {};
  }

  export class Detector {
    public static canCollide(filterA: Matter.ICollisionFilter, filterB: Matter.ICollisionFilter): boolean;
  }

  export class Common {
    public static random(): number;
    public static random(min: number, max: number): number;
  }
}
