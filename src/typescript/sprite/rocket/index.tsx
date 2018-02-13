import * as React from 'react';
import {Component} from 'react';
import {Image, View, ViewStyle} from 'react-native';
import IntrinsicBodyRef from "../IntrinsicBodyRef";
import * as Matter from 'matter-js';
import {ICollisionFilter} from 'matter-js';

export interface RocketProp extends IntrinsicBodyRef {
  label: string,
  collisionFilter: ICollisionFilter,
  center: {
    x: number,
    y: number,
  },
  angle: number,
}

const radius = 20;
export default class Rocket extends Component<RocketProp> {

  constructor(props: RocketProp) {
    super(props);
    const {center, label, angle, collisionFilter, bodyRef} = props;
    const body = Matter.Bodies.circle(center.x, center.y, radius, {
      label,
      angle,
      collisionFilter,
    });
    bodyRef && bodyRef(body);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  getRocketStyle(): ViewStyle {
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
        style={this.getRocketStyle()}
      >
        <Image
          source={require('./rocket.png')}
        />
      </View>
    );
  }
}
