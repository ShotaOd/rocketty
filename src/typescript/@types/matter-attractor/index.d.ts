declare module 'matter-attractors' {
  type AttractorConsumer = (a: Matter.Body, b: Matter.Body) => void | Matter.Vector;
  export = MatterAttractors;
  namespace MatterAttractors {
    export class Attractors {
      public static gravityConstant: number;
      public static gravity: AttractorConsumer;
    }
  }
}