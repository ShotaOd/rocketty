import * as React from 'react';
import {Image, View, ViewStyle} from 'react-native';
import {Obstacle, ObstacleProp} from "../Obstacle";
import * as Matter from 'matter-js';
import {getOAbsC} from "../../../support/Coordination";
import {Configuration} from "../../../Configuration";

const radius = 30;

export default class UFO extends Obstacle<ObstacleProp> {

  public static generateUpdateBody = () => {
    let lastDelta: number | undefined;
    return (b: Matter.Body) => {
      // init delta
      lastDelta = lastDelta || Date.now();
      // apply gravity
      b.force.y += 0.002;
      // check delta
      if (Date.now() - lastDelta < 500) return;
      Matter.Body.setVelocity(b, {x: b.velocity.x, y: -b.velocity.y});
      lastDelta = Date.now();
    }
  };

  initBody(props: ObstacleProp): Matter.Body {
    const {center: {x}} = props;
    const {gameRect} = Configuration;
    return Matter.Bodies.circle(x, gameRect.origin.y + Math.random() * gameRect.size.height, radius, {
      frictionAir: 0,
    });
  }

  protected modifyBody(b: Matter.Body, props: ObstacleProp): void {
    const x = (props.velocity.x > 0 ? 1 : -1) * 2;
    Matter.Body.setVelocity(b, {x, y: 0});
  }

  getStyle(): ViewStyle {
    const radius_2 = radius * 2;
    return {
      height: radius_2,
      width: radius_2,
      position: 'absolute',
      left: this.props.center.x - radius,
      top: this.props.center.y - radius,
      transform: [
        {rotate: `${this.props.angle * (180 / Math.PI)}deg`},
      ],
      borderRadius: radius,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'black',
    };
  }

  render() {
    return (
      <View
        style={this.getStyle()}
      >
        <Image
          source={require('./ufo.png')}
        />
      </View>
    );
  }
}
