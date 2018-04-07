// Type definitions for uuid-js 0.7
// Project: https://github.com/pnegri/uuid-js
// Definitions by: Mohamed Hegazy <https://github.com/mhegazy>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'uuid-js' {
  namespace UUID {
  }

  export interface uuid {
    equals(uuid: uuid): boolean;

    fromParts(timeLow: any, timeMid: any, timeHiAndVersion: any, clockSeqHiAndReserved: any, clockSeqLow: any, node: any): uuid;

    toBytes(): any[];

    toString(): string;
  }

  export function toURN(): string;

  export function create(version?: number): uuid;

  export function firstFromTime(time: number): uuid;

  export function fromBinary(binary: any): uuid;

  export function fromBytes(ints: number[]): uuid;

  export function fromTime(time: number, last?: boolean): uuid;

  export function fromURN(strId: any): uuid;

  export function getTimeFieldValues(time: any): any;

  export function lastFromTime(time: any): uuid;

  export const limitUI04: number;
  export const limitUI06: number;
  export const limitUI08: number;
  export const limitUI12: number;
  export const limitUI14: number;
  export const limitUI16: number;
  export const limitUI32: number;
  export const limitUI40: number;
  export const limitUI48: number;

  export function maxFromBits(bits: number): uuid;

  export function newTS(): uuid;

  export function paddedString(string: any, length: any, z: any): uuid;

  export function randomUI04(): uuid;

  export function randomUI06(): uuid;

  export function randomUI08(): uuid;

  export function randomUI12(): uuid;

  export function randomUI14(): uuid;

  export function randomUI16(): uuid;

  export function randomUI32(): uuid;

  export function randomUI40(): uuid;

  export function randomUI48(): uuid;
}
