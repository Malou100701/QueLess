import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  // Yderste wrapper omkring hele kort-sektionen
  container: {
    marginTop: spacing.lg,
  },

  // Wrapper omkring selve kortet (så vi kan lægge loader ovenpå)
  mapWrapper: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // Selve MapView-komponenten
  map: {
    width: '100%',
    height: '100%',
  },

  // Lille bokse-loader i hjørnet af kortet
  locationLoader: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Info-tekst under kortet
  infoContainer: {
    marginTop: 8,
  },

  infoAddress: {
    fontSize: 14,
    color: colors.muted || '#666',
    marginTop: 2,
  },

  infoDistance: {
    fontSize: 14,
    color: colors.muted || '#666',
    marginTop: 4,
  },
});
