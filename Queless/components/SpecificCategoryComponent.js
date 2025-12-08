// components/SpecificCategoryComponent.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ref, onValue, set, remove } from 'firebase/database';
import { rtdb, auth } from '../database/firebase';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/specificCategory.styles';
import AppHeader from './AppHeaderComponent';
import FavoriteToggleComponent from './FavoriteToggleComponent';

export default function SpecificCategoryComponent() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryTitle } = route.params;

  const [brandsInCategory, setBrandsInCategory] = useState(null);
  const [favoriteBrandIds, setFavoriteBrandIds] = useState({});

  // --------------------------------------------------------
  // Hent brands i den valgte kategori
  // --------------------------------------------------------
  useEffect(() => {
    const brandsReference = ref(rtdb, 'brands');

    const unsubscribeBrands = onValue(
      brandsReference,
      snapshot => {
        const dataFromDatabase = snapshot.val() || {};

        const allBrandsList = Object.entries(dataFromDatabase).map(
          ([brandIdFromDatabase, brandData]) => ({
            id: brandIdFromDatabase,
            ...brandData,
          })
        );

        const selectedCategoryIdLowercase = String(categoryId).toLowerCase();

        const filteredBrands = allBrandsList.filter(brand => {
          const categoryValue = brand.category;
          if (!categoryValue) return false;

          if (typeof categoryValue === 'string') {
            return (
              categoryValue.trim().toLowerCase() ===
              selectedCategoryIdLowercase
            );
          }

          if (typeof categoryValue === 'object') {
            const categoryValuesAsLowercaseStrings = Object.values(
              categoryValue
            ).map(singleCategoryValue =>
              String(singleCategoryValue).trim().toLowerCase()
            );

            return categoryValuesAsLowercaseStrings.includes(
              selectedCategoryIdLowercase
            );
          }

          return false;
        });

        setBrandsInCategory(filteredBrands);
      },
      error => {
        console.log('Firebase fejl ved hentning af brands:', error);
        setBrandsInCategory([]);
      }
    );

    return () => unsubscribeBrands();
  }, [categoryId]);

  // --------------------------------------------------------
  // Hent favoritter for den bruger, som er logget ind
  // --------------------------------------------------------
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const favoritesReference = ref(rtdb, `favorites/${currentUser.uid}`);

    const unsubscribeFavorites = onValue(favoritesReference, snapshot => {
      const favoritesFromDatabase = snapshot.val() || {};
      setFavoriteBrandIds(favoritesFromDatabase);
    });

    return () => unsubscribeFavorites();
  }, []);

  // --------------------------------------------------------
  // Skift favorit-status for et bestemt brand
  // --------------------------------------------------------
  const toggleFavoriteForBrand = (brandId) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
      return;
    }

    const singleFavoriteReference = ref(
      rtdb,
      `favorites/${currentUser.uid}/${brandId}`
    );

    if (favoriteBrandIds && favoriteBrandIds[brandId]) {
      // Brandet er favorit → fjern det
      remove(singleFavoriteReference);
    } else {
      // Brandet er ikke favorit → tilføj det
      set(singleFavoriteReference, true);
    }
  };

  // --------------------------------------------------------
  // Loader mens vi henter brands
  // --------------------------------------------------------
  if (!brandsInCategory) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  // --------------------------------------------------------
  // Hvis der ikke er nogen brands i denne kategori
  // --------------------------------------------------------
  if (brandsInCategory.length === 0) {
    return (
      <ScrollView style={styles.page} contentContainerStyle={styles.container}>
        <AppHeader
          title={categoryTitle}
          showBack={true}
          showLogout={true}
        />

        <Text>Der er ingen brands i denne kategori endnu.</Text>
      </ScrollView>
    );
  }

  // --------------------------------------------------------
  // Normal visning: vis alle brands i kategorien
  // --------------------------------------------------------
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title={categoryTitle}
        showBack={true}
        showLogout={true}
      />

      {brandsInCategory.map(brandItem => {
        const imageSource = localImagesByKey[brandItem.imageKey];
        if (!imageSource) return null;

        const isFavoriteForCurrentUser =
          !!(favoriteBrandIds && favoriteBrandIds[brandItem.id]);

        return (
          <TouchableOpacity
            key={brandItem.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('BrandDetail', {
                brandId: brandItem.id,
              })
            }
          >
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />

            {/* 🔹 Her bruger vi nu vores FavoriteToggleComponent */}
            <FavoriteToggleComponent
              isFavorite={isFavoriteForCurrentUser}
              onPress={() => toggleFavoriteForBrand(brandItem.id)}
              buttonStyle={styles.favoriteButton}
              iconStyle={styles.favoriteIcon}
            />

            {/* Brandets titel */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{brandItem.title}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
