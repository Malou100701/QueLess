import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, set, remove } from 'firebase/database';
import { rtdb, auth } from '../database/firebase';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/favorite.styles';
import AppHeader from './AppHeaderComponent';
import FavoriteToggleComponent from './FavoriteToggleComponent';

export default function FavoritesContent() {
  const [brands, setBrands] = useState([]); // alle brands
  const [favoriteIds, setFavoriteIds] = useState({}); // { brandId: true, ... }

  const navigation = useNavigation();

  // Henter alle brands (live)
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

    return unsubscribe;
  }, []);

  // Henter brugerens favoritter (live)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFavoriteIds({});
      return;
    }

    const userFavoritesRef = ref(rtdb, `favorites/${user.uid}`);

    const unsubscribe = onValue(userFavoritesRef, snapshot => {
      const data = snapshot.val() || {};
      setFavoriteIds(data);
    });

    return unsubscribe;
  }, []);

  // simpelt toggle (lad onValue opdatere state for os)
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
      return;
    }

    const favoriteRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    // Hvis den allerede findes → fjern
    // Ellers → tilføj
    if (favoriteIds[brandId]) {
      remove(favoriteRef);
    } else {
      set(favoriteRef, true);
    }
  };

  // Kun brands som er favoritter
  const favoriteBrands = brands.filter(brand => !!favoriteIds[brand.id]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader title="favoritter" uppercase={true} showLogout={true} />

      {favoriteBrands.length === 0 && (
        <Text style={styles.emptyText}>Du har ingen favoritter endnu.</Text>
      )}

      <View style={styles.listContainer}>
        {favoriteBrands.map(brand => {
          const imageSource = localImagesByKey[brand.imageKey];
          if (!imageSource) return null;

          const isFavorite = !!favoriteIds[brand.id];

          return (
            <TouchableOpacity
              key={brand.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('BrandDetail', {
                  brandId: brand.id,
                })
              }
            >
              <Image source={imageSource} style={styles.image} resizeMode="cover" />
              <View style={styles.overlay} />

              <FavoriteToggleComponent
                isFavorite={isFavorite}
                onPress={() => toggleFavorite(brand.id)}
              />

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{brand.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
