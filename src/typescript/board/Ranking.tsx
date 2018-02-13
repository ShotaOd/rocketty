import * as React from 'react'
import {Component} from 'react'
import {Text, View} from "react-native";

interface Props {
  page: number,
  size: number,
  prev: boolean,
  next: boolean,
  rows: {
    score: number,
    display_name: string,
  }[],
}

export default class Ranking extends Component<Props> {
  private renderRow(rank: number, score: number, display_name: string) {
    return (<View>
      <Text>{rank}</Text>
      <Text>{score}</Text>
      <br/>
      <Text>{display_name}</Text>
    </View>)
  }

  render() {
    const {page, size, next, prev, rows} = this.props;
    return rows
      .map((row, i) => this.renderRow((page * size) + i + 1, row.score, row.display_name));
  }
}