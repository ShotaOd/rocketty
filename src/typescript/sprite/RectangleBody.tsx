import * as React from 'react';
import {Component, ReactNode} from 'react';
import {View, ViewStyle} from "react-native";
import IntrinsicBodyRef from "./IntrinsicBodyRef";
import * as Matter from "matter-js";
import {Size, Vector} from "../support/Coordination";

interface Prop extends IntrinsicBodyRef {
  label?: string,
  isStatic: boolean,
  center: Vector,
  size: Size,
  color?: string,
  collisionFilter: {
    group: number,
    category: number,
    mask: number,
  },
}

export default class RectangleBody extends Component<Prop> {

  constructor(props: Prop) {
    super(props);
    const {size: {width, height}, center: {x, y}} = props;
    const body = Matter.Bodies.rectangle(x, y, width, height, props);
    props.bodyRef && props.bodyRef(body);
  }

  private getStyle(): ViewStyle {
    const {
      size: {
        width,
        height,
      },
      center,
      color,
    } = this.props;
    return {
      position: 'absolute',
      width,
      height,
      left: center.x - width / 2,
      top: center.y - height / 2,
      backgroundColor: color || 'transparent',
    };
  }

  render(): ReactNode {
    return (
      <View style={this.getStyle()}>
        {this.props.children}
      </View>
    );
  }
}

