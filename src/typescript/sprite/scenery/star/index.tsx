import * as React from 'react';
import {View} from 'react-native';
import {Scenery, SceneryProp} from '../Scenery';
import * as Matter from 'matter-js';
import {randBool} from '../../../support/Random';

const radius = 1;
export default class Star extends Scenery {

  private _color: string;

  constructor(props: SceneryProp) {
    super(props);
  }

  public static updateBody = (b: Matter.Body) => {
  };

  protected initBody(props: SceneryProp): Matter.Body {
    // calc velocity
    const x = Matter.Common.random(0.2, 0.5);
    const y = Matter.Common.random(0.5, 1);
    const velocity = {x: (randBool() ? -1 : 1) * x * 0.5, y};

    // set color according to velocity
    if (x * y > 1) {
      this._color = '#165572';
    } else {
      this._color = '#4a738e';
    }

    const {center} = props;
    const body = Matter.Bodies.circle(center.x, center.y, radius, {
      isSensor: true,
      frictionAir: 0,
    });
    Matter.Body.setVelocity(body, velocity);
    return body;
  }

  render() {
    const {center} = this.props;
    return (<View
      style={{
        position: 'absolute',
        backgroundColor: this._color,
        left: center.x - radius,
        top: center.y - radius,
        height: radius * 2,
        width: radius * 2,
        borderRadius: radius,
      }}
    />);
  }
}
