import { StyleSheet } from 'react-native';
import { spacing } from './theme'; // henter dine globale afstande

export default StyleSheet.create({
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,   
    left: spacing.sm,  
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',  
  },
});
