// style/ticketdetail.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Kun layout/padding – IKKE centring
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Fylder resten af højden under headeren og centrerer indholdet
  qrWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Kort rundt om QR-koden
  card: {
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.surface || '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
