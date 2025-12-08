// style/branddetail.styles.js
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

  image: {
    width: '100%',
    height: 200,
    marginTop:12,
    borderRadius: 16,
  },

  title: {
  fontSize: 24,
  fontWeight: '800',
  marginTop:12,
  marginBottom: 8,
},

  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },

  section: {
    marginTop: spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  muted: {
    fontSize: 14,
    color: colors.muted,
  },

  // 🔹 HVIDT CARD OM HELE LAGERSALGET
  saleCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: '#ffffffff',
    // lille skygge
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // header inde i lagersalg-card (dato + location + pil)
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  saleDate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },

  saleLocation: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },

  saleChevron: {
    fontSize: 18,
    color: colors.muted,
    paddingLeft: 8,
  },

  slotList: {
    marginTop: spacing.md,
  },

  // 🔹 HVIDE CARDS RUNDT OM TIDSSLIDERNE
  slotCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#edf5f8ff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  slotTime: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  slotCapacity: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },

  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
