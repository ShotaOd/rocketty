import * as React from 'react'
import {Component} from 'react'
import {Text, View,} from "react-native";
import RockettyRestClient from "../../api/RockettyRestClient";
import {Rank} from "../../api/ResponseType";
import TextButton from "../TextButton";
import {UserHighScore} from "../../common/Types";

interface Props {
  onBack: () => void;
  userHighScore?: UserHighScore,
}

interface State {
  loading: boolean,
  page: {
    current: number,
    prev: boolean,
    next: boolean,
  },
  ranks: {
    score: number,
    displayName: string,
  }[],
}

const DEFAULT_RANK_SIZE = 5;

class RankingRowText extends Component<{ size: number, children: string | number }> {
  render() {
    return (<View style={{justifyContent: 'center'}}>
      <Text style={{fontSize: this.props.size, color: '#283551', fontWeight: "bold"}}>{this.props.children}</Text>
    </View>);
  }
}

export default class RankingBoard extends Component<Props, State> {

  state = {
    loading: false,
    page: {
      current: 0,
      prev: false,
      next: false,
    },
    ranks: [],
  };

  componentDidMount(): void {
    this.fetch(this.state.page.current);
  }

  private fetch(pageNo: number) {
    this.setState({loading: true});
    RockettyRestClient.fetchScore(pageNo, DEFAULT_RANK_SIZE)
      .then(rankInfo => {
        const {ranks, page: {next, prev}} = rankInfo;
        const newState: State = Object.assign({}, this.state, {
          loading: false,
          ranks,
          page: {
            prev,
            next,
            current: pageNo,
          },
        });
        this.setState(newState);
      });
  }

  private renderRows() {
    const ranks: ReadonlyArray<Rank> = this.state.ranks;
    const {page: {current}} = this.state;
    const Separator = () => (<View style={{height: 1, backgroundColor: 'black'}}/>);
    return ranks.map((info: Rank, index: number) => {
      const {score, displayName} = info;
      const rankNo = current * DEFAULT_RANK_SIZE + index + 1;
      return (<View key={'RankingBoard#renderRows_' + rankNo}>
        <View style={{display: 'flex', flexDirection: 'row', padding: 20, justifyContent: 'space-between'}}>
          <RankingRowText size={20}>{rankNo}</RankingRowText>
          <RankingRowText size={15}>{displayName}</RankingRowText>
          <RankingRowText size={30}>{score}</RankingRowText>
        </View>
        {(() => {
          if (index + 1 !== ranks.length) {
            return <Separator/>
          }
        })()}
      </View>)
    });
  }

  private renderHeader() {
    if (!this.props.userHighScore) return;
    const {rank, score} = this.props.userHighScore;
    return (<View>
      <Text>{`rank: ${rank} score: ${score}`}</Text>
    </View>);
  }

  private renderFooter() {
    const {current, next, prev} = this.state.page;
    return (<View>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        {(() => {
          if (prev)
            return (<TextButton size={30} onPress={() => this.fetch(current - 1)}>◀</TextButton>);
        })()}
        {(() => {
          if (next)
            return (<TextButton size={30} onPress={() => this.fetch(current + 1)}>▶</TextButton>);
        })()}
      </View>
      {this.renderBack()}
    </View>);
  }

  private renderBack() {
    return (<TextButton onPress={this.props.onBack}>Back</TextButton>);
  }

  render() {
    const {loading} = this.state;
    if (loading) {
      return (<View>
        <Text>loading now...</Text>
        {this.renderBack()}
      </View>);
    }
    return (<View>
      {this.renderHeader()}
      {this.renderRows()}
      {this.renderFooter()}
    </View>);
  }
}