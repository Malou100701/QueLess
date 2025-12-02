 import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { rtdb } from './../database/firebase'; // firebase.js bruges her til at hente titler og informationer 
import { localImagesByKey } from './../data/ImageBundle';
import styles, { CARD_WIDTH, CARD_SPACING } from './../style/imageSlider.styles';

export default function ImageSliderContent() {
  const [brands, setBrands] = useState(null);

  useEffect(() => {
    const brandsRef = ref(rtdb, 'brands');

    const unsubscribe = onValue(brandsRef, snapshot => {
        console.log("onValue kaldt!");
      const data = snapshot.val() || {};

      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setBrands(list);
    });

    return () => unsubscribe();
  }, []);

  if (!brands) {
    return (
      <View style={[styles.sliderContainer, { alignItems: 'center', marginTop: 24 }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {brands.map(item => {
          const imageSource = localImagesByKey[item.imageKey];

          // hvis der ikke findes et billede til imageKey, så spring det over
          if (!imageSource) return null;

          return (
            <View key={item.id} style={styles.card}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />

              {/* mørk overlay */}
              <View style={styles.overlay} />

              {/* titel */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
