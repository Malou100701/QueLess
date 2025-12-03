// FavoritesComponent.js / FavoritesContent.js
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
import HeartOutline from '../assets/icons/heart-outline.png';
import HeartFilled from '../assets/icons/heart-filled.png';
import AppHeader from './AppHeaderComponent';

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

  // 3) Toggle favorit
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
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="favoritter"
        uppercase={true}
        showLogout={true}
      />

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

      {/* Tom tekst hvis ingen resultater */}
      {filteredFavorites.length === 0 && (
        <Text style={styles.emptyText}>
          {query
            ? 'Ingen favoritter matcher din søgning.'
            : 'Du har ingen favoritter endnu.'}
        </Text>
      )}

      {/* Kort-listen (samme kort-stil som før) */}
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

              {/* ❤️ favorit-knap */}
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
        })}
      </View>
    </ScrollView>
  );
}
