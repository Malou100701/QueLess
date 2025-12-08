// style/brandmap.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },

  mapWrapper: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },

  infoContainer: {
    paddingTop: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },

  infoAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },

  infoDistance: {
    fontSize: 13,
    color: '#777',
  },
});
