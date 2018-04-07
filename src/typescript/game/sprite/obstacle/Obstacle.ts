import * as Matter from 'matter-js';
import {Component} from "react";
import {Vector} from "../../support/Coordination";
import {CollisionCategory} from "../../support/Collision";

export interface ObstacleProp {
  id: number,
  center: {
    x: number,
    y: number,
  },
  label: string,
  angle: number,
  velocity: Vector,
  bodyRef?: (b: Matter.Body) => void,
}

export enum ObstacleType {
  Meteor = 'm',
  Wrench = 'w',
  Earth = 'e',
  UFO = 'u',
}

export abstract class Obstacle<Prop extends ObstacleProp> extends Component<Prop> {

  constructor(props: Prop) {
    super(props);
    const body = this.initBody(props);
    body.id = props.id;
    body.label = props.label;
    body.restitution = 0.8;
    body.collisionFilter = {
      group: 0,
      category: CollisionCategory.Game,
      mask: CollisionCategory.Game,
    };
    this.modifyBody(body, props);
    props.bodyRef && props.bodyRef(body);
  }

  protected abstract initBody(props: ObstacleProp): Matter.Body;

  protected modifyBody(b: Matter.Body, props: ObstacleProp) {
    Matter.Body.setVelocity(b, props.velocity);
  }
}
