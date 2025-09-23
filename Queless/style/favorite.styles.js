import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  listWrapper: {
    width: '70%',
    alignSelf: 'center',
    backgroundColor: '#8dc0f6ff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemText: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});