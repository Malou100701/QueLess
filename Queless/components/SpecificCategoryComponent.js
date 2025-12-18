import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ref, get, set, remove, onValue } from 'firebase/database';
import { rtdb, auth } from '../database/firebase';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/specificCategory.styles';
import { colors } from '../style/theme';
import AppHeader from './AppHeaderComponent';
import FavoriteToggleComponent from './FavoriteToggleComponent';

export default function SpecificCategoryComponent() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryTitle } = route.params;

  // Liste med brands i den valgte kategori
  const [brandsInCategory, setBrandsInCategory] = useState([]);

  // Favorit-brand-id'er for den nuværende bruger (fx { brandId1: true, brandId2: true })
  const [favoriteIds, setFavoriteIds] = useState({});

  // Søgetekst
  const [searchQuery, setSearchQuery] = useState('');

  // Hent brands i den valgte kategori (én gang)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsRef = ref(rtdb, 'brands');
        const snapshot = await get(brandsRef);
        const data = snapshot.val() || {};

        // Laver objektet om til en liste
        const allBrands = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        const selectedCategoryId = String(categoryId).toLowerCase();

        // Filtrér brands så vi kun tager dem, der matcher categoryId
        const filtered = allBrands.filter(brand => {
          const categoryValue = brand.category;
          if (!categoryValue) return false;

          if (typeof categoryValue === 'string') {
            return categoryValue.trim().toLowerCase() === selectedCategoryId;
          }

          if (typeof categoryValue === 'object') {
            const values = Object.values(categoryValue).map(value =>
              String(value).trim().toLowerCase()
            );
            return values.includes(selectedCategoryId);
          }

          return false;
        });

        setBrandsInCategory(filtered);
      } catch (error) {
        console.log('Fejl ved hentning af brands:', error);
        setBrandsInCategory([]);
      }
    };

    fetchBrands();
  }, [categoryId]);

  // Hent og lyt på favoritter for nuværende bruger (realtid)
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setFavoriteIds({});
      return;
    }

    const favoritesRef = ref(rtdb, `favorites/${user.uid}`);

    // onValue = lyt til ændringer i favorites/{user.uid}
    const unsubscribe = onValue(favoritesRef, snapshot => {
      const data = snapshot.val() || {};
      setFavoriteIds(data); // UI opdateres hver gang der sker noget i databasen
    });

    return unsubscribe;
  }, []);

  // Skift favorit-status for et brand
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
      return;
    }

    const favoriteRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    // Her opdaterer vi kun Firebase.
    // favoriteIds bliver automatisk opdateret via onValue-listeneren.
    if (favoriteIds[brandId]) {
      // Hvis det allerede er favorit → fjern
      remove(favoriteRef);
    } else {
      // Hvis det ikke er favorit → tilføj
      set(favoriteRef, true);
    }
  };

  // Filtrér brands i kategorien efter søgetekst
  const filteredBrands = brandsInCategory.filter(brand => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true; // ingen søgetekst → vis alle

    const title = String(brand.title || '').toLowerCase();
    return title.includes(query);
  });

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title={categoryTitle}
        showBack={true}
        showLogout={true}
      />

      {/* Søgefelt til at søge i brand-titler */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Søg i denne kategori…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Tekst hvis der ingen brands er */}
      {brandsInCategory.length === 0 && (
        <Text style={styles.emptyText}>
          Der er ingen brands i denne kategori endnu.
        </Text>
      )}

      {/* Tekst hvis søgningen ikke matcher noget */}
      {brandsInCategory.length > 0 && filteredBrands.length === 0 && (
        <Text style={styles.emptyText}>
          Ingen brands matcher din søgning.
        </Text>
      )}

      {filteredBrands.map(brand => {
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
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="cover"
            />
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
    </ScrollView>
  );
}
