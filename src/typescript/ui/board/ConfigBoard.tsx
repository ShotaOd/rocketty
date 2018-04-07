import * as React from 'react'
import {Component} from 'react'
import {TextInput, View,} from "react-native";
import TextButton from "../TextButton";
import RockettyUserDataManager from "../../data/RockettyUserDataManager";

type Props = {
  onBack: () => void;
}

type State = {
  displayName?: string;
}

export default class ConfigBoard extends Component<Props, State> {

  state: State = {
    displayName: "",
  };

  constructor(props: Props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleOnBack = this.handleOnBack.bind(this);
  }


  componentWillMount(): void {
    RockettyUserDataManager.fetchDisplayName()
      .then(displayName => this.setState({displayName}));
  }

  handleNameChange(displayName: string) {
    this.setState({displayName});
  }

  handleOnBack() {
    const {displayName} = this.state;
    displayName && RockettyUserDataManager.saveDisplayName(displayName);
    this.props.onBack();
  }

  private renderDisplayNameInput() {
    return (<TextInput
      style={{height: 40, borderColor: 'gray', borderWidth: 1}}
      onChangeText={this.handleNameChange}
      value={this.state.displayName}
    />);
  }

  private renderBack() {
    return (<TextButton onPress={this.handleOnBack}>Back</TextButton>);
  }

  render() {
    return (<View>
      {this.renderDisplayNameInput()}
      {this.renderBack()}
    </View>);
  }
}
