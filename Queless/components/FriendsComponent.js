// Malou Bjørnholt
import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import styles from '../style/home.styles'; 

export default function FriendsContent() {
  return (
    <ScrollView
      style={styles.page}                  
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Venner</Text>
      <Text style={styles.body}>Brug fanerne i bunden for at navigere.</Text>
    </ScrollView>
  );
}
