//denne fil bruges til at style image slideren på forsiden på home componenten
import { StyleSheet } from 'react-native';
import { colors,spacing } from './theme';

// Konstante værdier for kortene
export const CARD_WIDTH = 260;      // bredde på hvert kort
export const CARD_SPACING = 16;     // mellemrum mellem kort
export const CARD_HEIGHT = 170;     // højde på hvert kort

export default StyleSheet.create({
  // Wrapper omkring hele slider-sektionen
  sliderContainer: {
    marginTop: spacing.md,
  },

  // Indre styling til selve ScrollView-indholdet
  scrollContent: {
    paddingHorizontal: 5, 
  },

  // Det enkelte kort (brand-kortet)
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_SPACING,
    borderRadius: 20,
    overflow: 'hidden', // sørger for at billede/overlay følger rundede hjørner
  },

  // Selve billedet fylder hele kortet
  image: {
    width: '100%',
    height: '100%',
  },

  // Mørkt overlay oven på billedet
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  // Container til titel-teksten (placeret oven på billedet)
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center', // vertikalt centreret
    alignItems: 'center',     // horisontalt centreret
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
