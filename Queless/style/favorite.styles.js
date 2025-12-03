// style/favorites.styles.js
// Josephine Holst-Christensen

import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  // Hele siden
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Indholdet i FlatList
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },

  // Container rundt om søgefeltet
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
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
    padding: 20,
    color: colors.muted,
  },

  // CARD – samme stil som kategori-siden
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

  // ❤️ favorit-knap
  favoriteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  favoriteIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff', // hvidt hjerte
  },
});
