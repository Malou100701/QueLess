// imageSlider.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const CARD_WIDTH = screenWidth * 0.6;
export const CARD_SPACING = 16;
export const CARD_HEIGHT = 170;

export default StyleSheet.create({
  sliderContainer: {
    marginTop: 24,
  },

  scrollContent: {
    paddingLeft: 16,
    paddingRight: screenWidth - CARD_WIDTH - 16,
  },

card: {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  marginRight: CARD_SPACING,
  borderRadius: 20,
  overflow: 'hidden',
},

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {                     
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)', // mørke over HELE kortet
  },

  titleContainer: {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  justifyContent: 'center',   // vertikal centreret
  alignItems: 'center',       // horisontal centreret
},

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

