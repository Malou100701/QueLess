// style/favorite.styles.js
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

  listContainer: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },

  searchContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 10,
    borderRadius: 8,
  },

  emptyText: {
    paddingVertical: 20,
    color: colors.muted,
  },

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

});
