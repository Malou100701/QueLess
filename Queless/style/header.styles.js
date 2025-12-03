// style/header.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'left',
  },

  titleUppercase: {
    letterSpacing: 2, 
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'left',
  },

  icon: {
    width: 20,
    height: 20,
  },
});
