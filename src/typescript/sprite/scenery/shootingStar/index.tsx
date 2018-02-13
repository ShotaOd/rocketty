import * as React from 'react';
import {Scenery, SceneryProp} from "../Scenery";
import * as Matter from 'matter-js';
import {Configuration} from "../../../Configuration";
import Line from "../../Line";
import {Size} from "../../../support/Coordination";

const baseLength = 10;
export default class ShootingStar extends Scenery {

  private size: Size;

  constructor(props: SceneryProp) {
    super(props);
  }

  public static generateUpdateBody = () => {
    return (b: Matter.Body) => {
    }
  };

  protected initBody(props: SceneryProp): Matter.Body {
    const {center: {x, y}} = props;

    const b = x < Configuration.gameRect.size.width / 2;
    const body = Matter.Bodies.circle(x, y, 1, {
      frictionAir: 0,
    });
    const velocity = {x: (b ? 1 : -1) * (Math.random() * 2), y: Math.random() * 5 + 2};
    const velocityAngle = velocity.y / velocity.x;
    const width = (velocityAngle > 0 ? -1 : 1) * baseLength;
    const height = width * velocityAngle;
    this.size = {width, height};
    Matter.Body.setVelocity(body, velocity);
    return body;
  }

  render() {
    const {center} = this.props;
    const {width, height} = this.size;
    const from = {
      x: center.x - width/2,
      y: center.y - height/2,
    };
    const to = {
      x: center.x + width/2,
      y: center.y + height/2,
    };
    return (<Line
      zIndex={1001}
      from={from}
      to={to}
      color={'lightgray'}
      width={1}
    />);
  }
}
