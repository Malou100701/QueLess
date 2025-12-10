import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Indholdet på siden
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Tekst når der ingen bookinger er
  emptyText: {
    marginTop: spacing.lg,
    fontSize: 16,
    color: colors.muted,
  },

  // Overskrift "Kommende"
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginTop: spacing.md,
  },

  // Kort rundt om hver booking
  card: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor:'#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  // Brandnavn inde i kortet
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: colors.text,
  },

  // Almindelige linjer (dato, tid, lokation)
  line: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },

  // Række til knappen nederst i kortet
  buttonRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  // Selve "Annuller booking"-knappen
  cancelButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#ffdddd',
  },

  // Teksten inde i knappen
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b00020',
  },

    ticketButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#f4f1f1ff',
  },

  ticketButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b6667ff',
  },
});
