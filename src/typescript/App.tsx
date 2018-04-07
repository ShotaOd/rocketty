import * as React from 'react'
import {Component} from 'react'
import {Dimensions, ScaledSize, View} from 'react-native';
import Game from './game'
import * as Matter from "matter-js";
import 'matter-attractors';
import UIBoard from "./ui/board";
import RockettyUserDataManager from './data/RockettyUserDataManager';
import {UserHighScore} from "./common/Types";

Matter.use(
  'matter-attractors'
);

enum AppMode {
  Game,
  Board,
}

export enum InitializeState {
  SUCCESS,
  FAIL,
  TRYING,
}

type State = {
  initializeState: InitializeState,
  appMode: AppMode,
  latestScore: number,
  userHighScore?: UserHighScore,
};

// noinspection JSUnusedGlobalSymbols
export default class App extends Component<{}, State> {
  state: State = {
    initializeState: InitializeState.TRYING,
    appMode: AppMode.Game,
    latestScore: 0,
  };

  startGame: () => void;

  componentWillMount(): void {
    RockettyUserDataManager
      .initialize()
      .then(() => {
        this.setState({initializeState: InitializeState.SUCCESS})
      })
      .catch(() => {
        this.setState({initializeState: InitializeState.FAIL})
      });
  }

  render() {
    return (
      <View style={styles.window}>
        <Game
          refStart={startRef => this.startGame = startRef}
          onReady={() => this.setState({appMode: AppMode.Game})}
          onOver={latestScore => {
            this.setState({appMode: AppMode.Board, latestScore});
            RockettyUserDataManager.saveScore(latestScore);
          }}
        />
        <UIBoard
          initializeState={this.state.initializeState}
          show={this.state.appMode === AppMode.Board}
          onTapResume={this.startGame}
          score={this.state.latestScore}
          userHighScore={this.state.userHighScore}
        />
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
