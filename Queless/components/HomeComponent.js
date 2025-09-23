//Josephine Holst-Christensen
import * as React from 'react';
import { ScrollView, Text, Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../style/home.styles';

export default function HomeContent() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hjemmeskærm</Text>
      <Text style={styles.body}>Brug fanerne i bunden for at navigere.</Text>
      <View style={{ marginTop: 16 }}>
        <Button title="Log ud" onPress={() => navigation.navigate('Login')} />
        {/* En knap der navigere tilbage til login siden :) */}
      </View>
    </ScrollView>
  );
}
