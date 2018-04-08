import {AppRegistry} from 'react-native';
import App from './lib/App';
import {patch} from './src/javascript/misc/patch';

patch();
AppRegistry.registerComponent('rocketty', () => App);
