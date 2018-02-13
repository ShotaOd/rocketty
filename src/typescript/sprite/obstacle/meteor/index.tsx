import * as React from 'react';
import {Image, View, ViewStyle} from 'react-native';
import {Obstacle, ObstacleProp} from "../Obstacle";
import * as Matter from 'matter-js';

const radius = 30;
export default class Meteor extends Obstacle<ObstacleProp> {

  initBody(props: ObstacleProp): Matter.Body {
    const {center: {x, y}} = props;
    return Matter.Bodies.circle(x, y, radius, {
      frictionAir: 0,
    });
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
          source={require('./meteor_1.png')}
        />
      </View>
    );
  }
}
