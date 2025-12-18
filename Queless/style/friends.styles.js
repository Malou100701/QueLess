import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    padding: spacing.lg,    
  },

  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },

  comingSoon: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    opacity: 0.6,
  },
});
