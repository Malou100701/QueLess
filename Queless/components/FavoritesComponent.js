// components/FavoritesComponent.js / FavoritesContent.js
// Josephine Holst-Christensen
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
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

export default function FavoritesContent() {
  const [allBrands, setAllBrands] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  // Lav liste med kun favoritter + filtrér på søgetekst
  const filteredFavorites = useMemo(() => {
    const favoritesOnly = allBrands.filter(brand => !!favoriteIds[brand.id]);

    const q = query.trim().toLowerCase();
    if (!q) return favoritesOnly;

    return favoritesOnly.filter(brand =>
      String(brand.title || '').toLowerCase().includes(q)
    );
  }, [allBrands, favoriteIds, query]);

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

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="favoritter"
        uppercase={true}
        showLogout={true}
      />

      {/* Søgefelt til at filtrere favoritter */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Søg i dine favoritter…"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Tekst hvis der ikke er nogen favoritter eller ingen match */}
      {filteredFavorites.length === 0 && (
        <Text style={styles.emptyText}>
          {query
            ? 'Ingen favoritter matcher din søgning.'
            : 'Du har ingen favoritter endnu.'}
        </Text>
      )}

      <View style={styles.listContainer}>
        {filteredFavorites.map(item => {
          const imageSource = localImagesByKey[item.imageKey];
          if (!imageSource) return null;

          const isFavorite = !!favoriteIds[item.id];

          return (
            <View key={item.id} style={styles.card}>
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
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
