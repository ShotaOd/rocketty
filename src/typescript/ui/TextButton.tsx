import * as React from 'react'
import {Component} from 'react'
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

interface Props {
  onPress: () => void;
  size?: number;
  children: string | number
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5,
    backgroundColor: '#283551',
    alignItems: 'center',
    flexGrow: 1,
    margin: 10,
  },
});
const textStyle = {
  color: 'darkgray',
};
export default class TextButton extends Component<Props> {
  render() {
    const fontSize = this.props.size || 50;
    return (<TouchableWithoutFeedback onPress={this.props.onPress}>
      <View style={styles.buttonContainer}>
        <Text style={Object.assign({ fontSize }, textStyle)}>{this.props.children}</Text>
      </View>
    </TouchableWithoutFeedback>);
  }
}