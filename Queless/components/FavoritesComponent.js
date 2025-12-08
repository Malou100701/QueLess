// components/FavoritesComponent.js / FavoritesContent.js
// Josephine Holst-Christensen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../style/theme';
import { rtdb, auth } from '../database/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/favorite.styles';
import AppHeader from './AppHeaderComponent';
import FavoriteToggleComponent from './FavoriteToggleComponent';
import { useNavigation } from '@react-navigation/native';   // 🔹 tilføjet

export default function FavoritesContent() {
  const [allBrands, setAllBrands] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState({});
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); // 🔹 nu kan vi navigere

  // Hent alle brands
  useEffect(() => {
    const brandsRef = ref(rtdb, 'brands');

    const unsubscribe = onValue(brandsRef, snapshot => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setAllBrands(list);
      setLoading(false);
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

  // Tilføj/fjern favorit i Firebase
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  // Kun brands der er favoritter
  const favoritesOnly = allBrands.filter(brand => !!favoriteIds[brand.id]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="favoritter"
        uppercase={true}
        showLogout={true}
      />

      {/* Hvis der ingen favoritter er */}
      {favoritesOnly.length === 0 && (
        <Text style={styles.emptyText}>
          Du har ingen favoritter endnu.
        </Text>
      )}

      <View style={styles.listContainer}>
        {favoritesOnly.map(item => {
          const imageSource = localImagesByKey[item.imageKey];
          if (!imageSource) return null;

          const isFavorite = !!favoriteIds[item.id];

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}

              // 🔹 HER TILFØJER VI BRANDDETAIL NAVIGATIONEN
              onPress={() =>
                navigation.navigate('BrandDetail', {
                  brandId: item.id,
                })
              }
            >
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay} />

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
      </View>
    </ScrollView>
  );
}
