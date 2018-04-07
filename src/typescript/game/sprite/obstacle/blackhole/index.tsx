// library
import * as React from 'react';
import {Component} from 'react';
import {View, ViewStyle} from 'react-native';
import * as Matter from 'matter-js';
import {Vector} from 'matter-js';
// support
import {CollisionCategory} from "../../../support/Collision";

const maxRadius = 100;

export interface BlackHoleProp {
  id: string,
  enable: boolean;
  center: {
    x: number,
    y: number,
  },
  label: string,
  bodyRef: (b: Matter.Body) => void,
}

export default class BlackHole extends Component<BlackHoleProp> {

  private _body: Matter.Body;
  private _startTm: number;

  private gravityAttractor(a: Matter.Body, b: Matter.Body): Vector | undefined {
    if (!this.props || !this.props.enable || !Matter.Detector.canCollide(a.collisionFilter, b.collisionFilter)) {
      return;
    }
    return {
      x: (a.position.x - b.position.x) * 3e-6,
      y: (a.position.y - b.position.y) * 5e-8,
    };
  }

  constructor(props: BlackHoleProp) {
    super(props);
    const {center: {x, y}, label} = props;
    const blackHoleBody = Matter.Bodies.circle(x, y, 50, {
      label,
      frictionAir: 0,
      isStatic: true,
      collisionFilter: {
        group: 0,
        category: CollisionCategory.Game,
        mask: CollisionCategory.Game,
      },
      plugin: {
        attractors: [
          this.gravityAttractor.bind(this),
        ],
      }
    });
    this._body = blackHoleBody;
    this.props.bodyRef(blackHoleBody);
  }


  componentWillReceiveProps(nextProps: Readonly<BlackHoleProp>, nextContext: any): void {
    if (!this.props.enable && nextProps.enable) {
      this._startTm = Date.now();
    }
    const {center} = nextProps;
    Matter.Body.setPosition(this._body, center);
  }

  getStyle(): ViewStyle {
    const current = Date.now();
    const radius = maxRadius * 2 * (current - this._startTm) / 5000;
    return {
      height: radius * 2,
      width: radius * 2,
      position: 'absolute',
      left: this.props.center.x - radius,
      top: this.props.center.y - radius,
      borderRadius: radius,
      backgroundColor: this.props.enable ? 'black' : 'transparent',
    };
  }

  render() {
    return (
      <View
        style={this.getStyle()}
      />
    );
  }
}
