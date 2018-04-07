import * as React from 'react';
import {Image, View, ViewStyle} from 'react-native';
import * as Matter from 'matter-js';
import {Obstacle, ObstacleProp} from "../Obstacle";


const radius = 30;
export default class Earth extends Obstacle<ObstacleProp> {

  initBody(props: ObstacleProp): Matter.Body {
    const {center: {x, y}} = props;
    const earthBody = Matter.Bodies.circle(x, y, radius, {
      frictionAir: 0,
    });
    Matter.Body.setAngularVelocity(earthBody, -0.01);
    return earthBody;
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
        {rotate: `${this.props.angle}rad`},
      ],
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: radius,
    };
  }

  render() {
    return (
      <View
        style={this.getStyle()}
      >
        <Image
          source={require('./earth.png')}
        />
      </View>
    );
  }
}
