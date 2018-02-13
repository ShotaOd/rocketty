import * as React from 'react'
import {Component} from 'react'
import {TouchableWithoutFeedback, View, ViewStyle} from 'react-native';

interface Props {
  onTap: () => void;
  radius: number,
  center: {
    x: number,
    y: number,
  },
  color?: string,
}

export default class CircleButton extends Component<Props> {

  getButtonStyle(): ViewStyle {
    const {radius, center, color = 'gray'} = this.props;
    return {
      borderRadius: radius,
      height: radius * 2,
      width: radius * 2,
      backgroundColor: color,
      opacity: 0.5,
      position: 'absolute',
      left: center.x - radius,
      top: center.y - radius,
    };
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onTap}
      >
        <View
          style={this.getButtonStyle()}
        />
      </TouchableWithoutFeedback>
    );
  }
}