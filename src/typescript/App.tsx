import * as React from 'react'
import {Component} from 'react'
import {Dimensions, ScaledSize, View} from 'react-native';
import Game from './Game'
import * as Matter from "matter-js";
import 'matter-attractors';

Matter.use(
  'matter-attractors'
);

export default class App extends Component {
  render() {
    return (
      <View style={styles.window}>
        <Game/>
      </View>
    );
  }
}

const createWindowSize = (window: ScaledSize) => {
  return {
    width: window.width,
    height: window.height,
  };
};

const window = Dimensions.get('window');
const styles = {
  window: createWindowSize(window),
};
