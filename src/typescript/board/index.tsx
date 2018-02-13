import * as React from 'react'
import {Component} from 'react'
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ranking from "./Ranking";

interface Props {

  score?: number,
  onTapResume: () => void,
}

enum ViewState {
  top,
  ranking,
}

interface State {
  view: ViewState,
}

export default class WaitBoard extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      view: ViewState.top,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {(() => {
          switch (this.state.view) {
            case ViewState.top:
              return this.renderTop();
            case ViewState.ranking:
              return <Ranking />;
          }
        })()}
      </View>
    );
  }
}
