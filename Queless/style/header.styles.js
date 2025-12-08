// style/header.styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  sideRight: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // bruges når uppercase skal stå til venstre
  titleContainerLeft: {
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  titleUppercase: {
    letterSpacing: 2,
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'left',
  },

  icon: {
    width: 18,
    height: 18,
  },
});
