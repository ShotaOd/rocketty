import {Dimensions, StyleSheet} from "react-native";
const pad = 20;
const window = Dimensions.get('window');
const width = window.width - pad * 2;
const height = window.height - pad * 2;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: pad,
    top: pad,
    width,
    height,
    borderRadius: 20,
    backgroundColor: 'darkgray',
    opacity: 0.8,
    zIndex: 1000,
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  scoreText: {
    height: 140,
    fontSize: 100,
    alignItems: 'center',
  },
  button: {
    height: 140,
    borderRadius: 20,
    backgroundColor: 'deepskyblue',
    alignItems: 'center',
  },
  text: {
    color: '#333',
    fontSize: 100,
  },
});