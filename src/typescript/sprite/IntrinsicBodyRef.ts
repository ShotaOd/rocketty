import * as Matter from 'matter-js';

export default interface IntrinsicBodyRef {
  bodyRef?: (b: Matter.Body) => void;
}
