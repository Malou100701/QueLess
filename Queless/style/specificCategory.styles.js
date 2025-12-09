import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  // Yderste ScrollView
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Indholdet inde i siden
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: 20,
  },

  /* BRAND-CARDS */
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 170,
    marginBottom: spacing.md,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    // Fylder hele kortet og lægger et mørkt lag over billedet
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  titleContainer: {
    // Placerer titel-teksten centreret oven på billedet
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  // Søgefeltets wrapper
  searchContainer: {
    marginTop: 10,
    marginBottom: 20,
  },

  // Selve søgefeltet
  searchInput: {
    height: 44,
    backgroundColor: colors.surface || '#f3f3f3',
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 14,
  },

  // Tekst til “ingen brands” / “ingen søgeresultater”
  emptyText: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 14,
    color: colors.muted || '#666',
    textAlign: 'center',
  },
});
