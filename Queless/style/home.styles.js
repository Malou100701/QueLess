// src/styles/home.styles.js
import { StyleSheet } from 'react-native';
import { spacing, colors } from './theme';

export default StyleSheet.create({
  page: {              
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { fontSize: 24, marginBottom: spacing.md, color: colors.text },
  body: { textAlign: 'center', color: colors.muted },
});
