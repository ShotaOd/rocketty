import * as React from 'react'
import {Component} from 'react'
import {Text, View} from 'react-native';
import Styles from "./Styles";
import Top from "./Top";
import RankingBoard from "./RankingBoard";
import {InitializeState} from "../../App";
import {UserHighScore} from "../../common/Types";
import ConfigBoard from "./ConfigBoard";
import RockettyUserDataManager from "../../data/RockettyUserDataManager";

interface Props {
  score?: number,
  onTapResume: () => void,
  show: boolean,
  userHighScore?: UserHighScore,
  initializeState: InitializeState,
}

enum ViewState {
  TOP,
  RANK,
  CONF,
}

interface State {
  view: ViewState,
}

export default class UIBoard extends Component<Props, State> {

  state: State = {
    view: ViewState.TOP,
  };

  private renderTop() {
    return (<Top
      score={this.props.score}
      onTapStart={this.props.onTapResume}
      onTapRanking={() => this.setState({view: ViewState.RANK})}
      onTapConfig={() => this.setState({view: ViewState.CONF})}
    />);
  }

  private renderRanking() {
    return (<RankingBoard
      onBack={() => this.setState({view: ViewState.TOP})}
      userHighScore={this.props.userHighScore}
    />);
  }

  private renderConf() {
    return (<ConfigBoard
      onBack={() => this.setState({view: ViewState.TOP})}
    />);
  }

  render() {
    if (!this.props.show) return null;
    return (
      <View style={Styles.container}>
        {(() => {
          switch (this.state.view) {
            case ViewState.TOP:
              return this.renderTop();
            case ViewState.RANK:
              return this.renderRanking();
            case ViewState.CONF:
              return this.renderConf();
          }
        })()}
      </View>
    );
  }
}
