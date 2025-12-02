// Josephine Holst-Christensen
import { StyleSheet } from 'react-native';
import { spacing, colors } from './theme';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background, // lyseblå, næsten hvid
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  title: { fontSize: 30, fontWeight: '700', marginBottom: spacing.md, color: colors.text },

  body: { textAlign: 'center', color: colors.muted },

  sliderSection: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: 30, 
  },

  smallerTitles: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  logoutIcon: {
  position: 'absolute',
  top: 0,  
  right: 20,
  zIndex: 10,
},

});