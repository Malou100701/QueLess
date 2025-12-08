// style/categoryScreen.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: 20, // luft ned fra notch/header
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* HEADER */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  backIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  titleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  /* --------------------------------------------- */
  /* 🔍 NYE TILFØJEDE STYLES TIL SØGEFELTET */
  /* --------------------------------------------- */

  searchContainer: {
    marginTop: 10,
    marginBottom: 20,
  },

  searchInput: {
    height: 44,
    backgroundColor: colors.surface || '#f3f3f3',
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 14,
  },

  emptyText: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 14,
    color: colors.muted || '#666',
    textAlign: 'center',
  },
});
