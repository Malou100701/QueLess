import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },

  titleUppercase: {
    flex: 1,
    textAlign: 'left',  
    letterSpacing: 2,
    fontWeight: '900',
    fontSize: 32,
  },

  icon: {
    width: 18,
    height: 18,
  },
});
