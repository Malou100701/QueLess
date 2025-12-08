// style/myoutlets.styles.js
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
    paddingBottom: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.lg,
    fontSize: 16,
    color: colors.muted,
  },
  card: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: '#ffffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: colors.text,
  },
  line: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },

  buttonRow: {
  marginTop: 10,
  flexDirection: 'row',
  justifyContent: 'flex-end',
},

cancelButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 999,
  backgroundColor: '#ffdddd',
},

cancelButtonText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#b00020',
},
});
