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
    paddingTop: 20,    // luft ned fra notch/header
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

  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
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
  // favorit-knap
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
    tintColor: '#fff' 
  },
});
