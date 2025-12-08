import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, set, remove } from 'firebase/database';
import { rtdb, auth } from './../database/firebase';
import { localImagesByKey } from './../data/ImageBundle';
import styles, { CARD_WIDTH, CARD_SPACING } from './../style/imageSlider.styles';
import FavoriteToggleComponent from './FavoriteToggleComponent';

export default function ImageSliderContent() {
  const [brands, setBrands] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState({});
  const navigation = useNavigation();

  // Hent alle brands
  useEffect(() => {
    const brandsRef = ref(rtdb, 'brands');

    const unsubscribe = onValue(brandsRef, snapshot => {
      const data = snapshot.val() || {};

      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setBrands(list);
    });

    return () => unsubscribe();
  }, []);

  // Hent favoritter for nuværende bruger
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFavoriteIds({});
      return;
    }

    const favRef = ref(rtdb, `favorites/${user.uid}`);

    const unsubscribe = onValue(favRef, snapshot => {
      const data = snapshot.val() || {};
      setFavoriteIds(data);
    });

    return () => unsubscribe();
  }, []);

  // Skift favorit-status for et brand
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('Ingen bruger logget ind');
      return;
    }

    const favRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    if (favoriteIds && favoriteIds[brandId]) {
      remove(favRef);
    } else {
      set(favRef, true);
    }
  };

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
          if (!imageSource) return null;

          const isFavorite = !!favoriteIds[item.id];

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('BrandDetail', { brandId: item.id })}
            >
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.overlay} />

              {/* favorit-hjerte */}
              <FavoriteToggleComponent
                isFavorite={isFavorite}
                onPress={() => toggleFavorite(item.id)}
                buttonStyle={styles.favoriteButton}
                iconStyle={styles.favoriteIcon}
              />

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
