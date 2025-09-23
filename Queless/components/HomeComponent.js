// Josephine Holst-Christensen
import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import styles from '../style/home.styles';

export default function HomeContent() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hjemmeskærm</Text>
      <Text style={styles.body}>Brug fanerne i bunden for at navigere.</Text>
    </ScrollView>
  );
}
