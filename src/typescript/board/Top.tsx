import * as React from 'react';
import {Component, default as React} from 'react';
import {Text, TouchableOpacity, View} from "react-native";

interface Props {
  score?: number,
  onTapStart: () => void,
  onTapRanking: () => void,
}

class Score extends Component<{score?: number}>{
  render() {
    if (!score) return;
    return (<Text style={styles.scoreText}>
      {score}
    </Text>);
  }
}

export default class Top extends Component<Props, State> {
  render() {
    return (<View>
      <Score score={this.props.score} />
      <TouchableOpacity
        style={styles.button}
        onPress={this.props.onTapResume}
      >
        <Text style={styles.text}>start</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.setState({view: ViewState.ranking})}
      >
        <Text style={styles.text}>ranking</Text>
      </TouchableOpacity>
    </View>);
  }

}