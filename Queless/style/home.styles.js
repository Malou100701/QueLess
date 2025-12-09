import { StyleSheet } from 'react-native';
import { spacing, colors } from './theme';

export default StyleSheet.create({
  // Hele siden
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Indhold der får luft fra kanterne
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },

  // Stor titel
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.text,
  },


  // Sektion med image-slider
  sliderSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },

  // Mindre sektionstitler
  smallerTitles: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,   
  },
});
