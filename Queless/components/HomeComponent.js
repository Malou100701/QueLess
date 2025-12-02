// HomeContent.js
import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../style/home.styles';
import ImageSliderContent from './ImageSliderComponent';
import CategoryComponent from './CategoryComponent';

export default function HomeContent() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>

      {/* Sektion: UDFORSK + image slider */}
      <View style={styles.sliderSection}>
        <Text style={styles.smallerTitles}>UDFORSK</Text>
        <ImageSliderContent />
      </View>

     <View style={{ marginTop: 32 }}>
        <Text style={styles.smallerTitles}>KATEGORIER</Text>
        <CategoryComponent />
      </View>

    </ScrollView>
  );
}
