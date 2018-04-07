import * as React from 'react';
import {Component, ReactNode} from 'react';
import {View, ViewStyle} from "react-native";
import {Vector} from "../support/Coordination";

interface Prop {
  from: Vector,
  to: Vector,
  color: string,
  zIndex: number,
  width?: number,
}

export default class Line extends Component<Prop> {

  constructor(props: Prop) {
    super(props);
  }

  /**
   *                to
   *   ┌────────────
   * y │          ／
   * D │        ／
   * i │      ／
   * f │    ／ radius
   * f │  ／
   *   │／ ) θ
   *   └────────────
   * from   xDiff
   * @return {ViewStyle}
   */
  private getStyle(): ViewStyle {
    const {
      from,
      to,
      color,
      zIndex,
      width,
    } = this.props;
    const yDiff = to.y - from.y;
    const xDiff = to.x - from.x;
    const radius = Math.sqrt(xDiff ** 2 + yDiff ** 2);
    const radian = Math.asin(yDiff / radius);
    const oriented = Object.assign({radian}, from);
    oriented.y += radius / 2 * Math.sin(radian);
    const rotateXDiff = radius / 2 * Math.cos(radian);
    if (from.x < to.x) {
      oriented.x -= radius / 2 - rotateXDiff;
      // oriented.radian = radian;
    } else {
      oriented.x -= radius / 2 + rotateXDiff;
      oriented.radian = -1 * oriented.radian + Math.PI;
    }
    return {
      position: 'absolute',
      top: oriented.y,
      left: oriented.x,
      transform: [
        {rotate: `${oriented.radian}rad`},
      ],
      width: radius,
      height: width || 1,
      backgroundColor: color,
      zIndex,
    };
  }

  render(): ReactNode {
    return (
      <View style={this.getStyle()}>
        <View style={{top: 0, left: 0, width: 2, height: 2, backgroundColor: 'black'}}/>
      </View>
    );
  }
}

