import * as Matter from "matter-js";

export const randBool = () => Matter.Common.random(0,1) >= 0.5;
export const randInt = (upper: number): number => Math.round(Math.random() * (upper - 1)) + 1;
