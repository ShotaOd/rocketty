import * as Matter from 'matter-js';
import {Component} from "react";
import {CollisionCategory} from "../../support/Collision";
import {Vector} from "../../support/Coordination";

export interface SceneryProp {
  id: number,
  center: Vector,
  label: string,
  angle: number,
  bodyRef?: (b: Matter.Body) => void,
}

export enum SceneryType {
  Star = 's',
  ShootingStar = 'ss',
}

export abstract class Scenery extends Component<SceneryProp> {

  constructor(props: SceneryProp) {
    super(props);
    const body = this.initBody(props);
    body.id = props.id;
    body.label = props.label;
    body.collisionFilter = {
      group: 0,
      category: CollisionCategory.Back,
      mask: CollisionCategory.Back,
    };
    props.bodyRef && props.bodyRef(body);
  }

  protected abstract initBody(props: SceneryProp): Matter.Body;
}
