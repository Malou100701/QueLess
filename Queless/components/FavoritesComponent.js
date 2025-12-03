// FavoritesComponent.js / FavoritesContent.js
// Josephine Holst-Christensen
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
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
import HeartOutline from '../assets/icons/heart-outline.png';
import HeartFilled from '../assets/icons/heart-filled.png';

export default function FavoritesContent() {
  const [allBrands, setAllBrands] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState({});
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 1) Hent alle brands
  useEffect(() => {
    const brandsRef = ref(rtdb, 'brands');

    const unsub = onValue(brandsRef, snapshot => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setAllBrands(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2) Hent favoritter for nuværende bruger
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFavoriteIds({});
      return;
    }

    const favRef = ref(rtdb, `favorites/${user.uid}`);

    const unsub = onValue(favRef, snapshot => {
      const data = snapshot.val() || {}; // fx { bareen: true, billibi: true }
      setFavoriteIds(data);
    });

    return () => unsub();
  }, []);

  // 3) Toggle favorit (samme som på Category-screen)
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('Ingen bruger logget ind');
      return;
    }

    const favRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    if (favoriteIds && favoriteIds[brandId]) {
      // var favorit → fjern
      remove(favRef);
    } else {
      // ikke favorit → tilføj
      set(favRef, true);
    }
  };

  // 4) Udregn favorit-liste + søgning
  const filteredFavorites = useMemo(() => {
    const favoritesOnly = allBrands.filter(b => !!favoriteIds[b.id]);

    const q = query.trim().toLowerCase();
    if (!q) return favoritesOnly;

    return favoritesOnly.filter(b =>
      String(b.title || '').toLowerCase().includes(q)
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
    <View style={styles.page}>
      {/* Søgefelt */}
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

      {/* Liste med store kort */}
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {query
              ? 'Ingen favoritter matcher din søgning.'
              : 'Du har ingen favoritter endnu.'}
          </Text>
        }
        renderItem={({ item }) => {
          const imageSource = localImagesByKey[item.imageKey];
          if (!imageSource) return null;

          const isFavorite = !!favoriteIds[item.id];

          return (
            <View style={styles.card}>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.overlay} />

              {/* ❤️ favorit-knap – også til at fjerne fra listen */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.id)}
              >
                <Image
                  source={isFavorite ? HeartFilled : HeartOutline}
                  style={styles.favoriteIcon}
                />
              </TouchableOpacity>

              {/* Titel i midten */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
