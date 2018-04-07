import {Dimensions, StyleSheet} from "react-native";
const pad = 20;
const window = Dimensions.get('window');
const width = window.width - pad * 2;
const height = window.height - pad * 4;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: pad,
    top: pad * 2,
    width,
    height,
    borderRadius: 20,
    backgroundColor: 'darkgray',
    opacity: 0.8,
    zIndex: 1000,
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
});