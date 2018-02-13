import * as React from 'react';
import {Image, View, ViewStyle} from 'react-native';
import * as Matter from 'matter-js';
import {Obstacle, ObstacleProp} from "../Obstacle";


const height = 20;
const width = 56;
export default class Wrench extends Obstacle<ObstacleProp> {

  initBody(props: ObstacleProp): Matter.Body {
    const {center: {x, y}} = props;
    const wrenchBody = Matter.Bodies.rectangle(x, y, width, height, {
      frictionAir: 0,
    });
    Matter.Body.setAngularVelocity(wrenchBody, -0.1);
    return wrenchBody;
  }

  getStyle(): ViewStyle {
    return {
      height,
      width,
      position: 'absolute',
      left: this.props.center.x - width / 2,
      top: this.props.center.y - height / 2,
      transform: [
        {rotate: `${this.props.angle}rad`},
      ],
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
          source={require('./wrench.png')}
        />
      </View>
    );
  }
}
