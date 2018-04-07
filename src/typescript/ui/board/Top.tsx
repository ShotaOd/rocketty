import * as React from 'react';
import {Component} from 'react';
import {Text, View} from "react-native";
import TextButton from "../TextButton";
import RockettyUserDataManager from "../../data/RockettyUserDataManager";

interface ScoreProps {
  score?: number,
}

interface Props extends ScoreProps {
  onTapStart: () => void,
  onTapRanking: () => void,
  onTapConfig: () => void,
}

interface State {
  alert: boolean,
}

class Score extends Component<{ score?: number }> {
  render() {
    const {score} = this.props;
    if (!score) return;
    return (<View>
      <Text style={{fontSize: 100, color: '#283551'}}>
        {score}
      </Text>
    </View>);
  }
}

const HR = () => (<View style={{height: 2, backgroundColor: '#283551', marginVertical: 10}}/>);

export default class Top extends Component<Props, State> {

  state: State = {
    alert: false,
  };

  componentWillMount(): void {
    RockettyUserDataManager.fetchDisplayName()
      .then(displayName => this.setState({alert: !!displayName}));
  }

  render() {
    return (<View>
      <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Score score={this.props.score}/>
      </View>
      <HR />
      <TextButton size={100} onPress={this.props.onTapStart}>
        Start
      </TextButton>
      <TextButton size={50} onPress={this.props.onTapRanking}>
        Rank
      </TextButton>
      <TextButton size={50} onPress={this.props.onTapConfig}>
        {(() => {
          if (this.state.alert) return 'Config';
          return 'Config ⚠'
        })()}
      </TextButton>
    </View>);
  }

}