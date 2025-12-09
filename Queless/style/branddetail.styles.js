// style/branddetail.styles.js
import { StyleSheet } from 'react-native';
import { colors, spacing } from './theme';

export default StyleSheet.create({
  // Yderste ScrollView
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Indholdet under billedet
  container: {
    flexGrow: 1,
    padding: spacing.lg,
  },

  // Wrapper til AppHeader
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  // Bruges til loader og fejlbesked midt på skærmen
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Brand-billedet øverst
  image: {
    width: '100%',
    height: 220,
  },

  // Brand-titel
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
    color: colors.text,
  },

  // Brand-beskrivelse
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },

  // Sektion (fx "Kommende lagersalg")
  section: {
    marginTop: spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  // Grå, lidt mere afdæmpet tekst
  muted: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },

  // Card rundt om et helt lagersalg
  saleCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 18,
    backgroundColor: colors.surface || '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Øverste række i lagersalg-card (dato + adresse + pil)
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


  // Liste med tidsrum under et lagersalg
  slotList: {
    marginTop: spacing.md,
  },

  // Card rundt om ét tidsrum
  slotCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface || '#edf5f8ff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Venstre side i slotCard (tid + kapacitet)
  slotInfo: {
    flex: 1,
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

  // Standard "Book"-knap
  bookButton: {
    backgroundColor: colors.primary || '#4caf81ff',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
  },

  bookButtonText: {
    color: colors.onPrimary || '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Når tidsrummet er udsolgt
  bookButtonSoldOut: {
    backgroundColor: colors.error || '#a54340ff',
  },

  // Når brugeren allerede har booket et tidsrum for dette lagersalg
  bookButtonAlreadyBooked: {
    backgroundColor: colors.muted || '#9E9E9E',
  },
});
