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

// Denne side viser alle brands i én bestemt kategori.
// Man kan søge i brand-navne og like/unlike et brand med hjertet.
export default function SpecificCategoryComponent() {
  const route = useRoute();
  const navigation = useNavigation();

  // Vi får kategori-id og titel fra den side vi kom fra (fx Home)
  const { categoryId, categoryTitle } = route.params;

  // Brands som passer til den valgte kategori
  const [brandsInCategory, setBrandsInCategory] = useState([]);

  // Brugerens favoritter (brandId -> true)
  const [favoriteIds, setFavoriteIds] = useState({});

  // Det brugeren skriver i søgefeltet
  const [searchQuery, setSearchQuery] = useState('');

  // Henter alle brands fra databasen og udvælger kun dem, der matcher categoryId
  // (køres når categoryId ændrer sig)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsRef = ref(rtdb, 'brands');

        // get() henter data én gang (ikke live)
        const snapshot = await get(brandsRef);
        const data = snapshot.val() || {};

        // Laver databasen-objekt om til en liste, så vi kan filter/map
        const allBrands = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        // Vi normaliserer categoryId, så små/store bogstaver ikke betyder noget
        const selectedCategoryId = String(categoryId).toLowerCase();

        // Filtrér så vi kun beholder brands der hører til denne kategori
        // (nogle brands kan have category som tekst eller som et objekt)
        const filtered = allBrands.filter(brand => {
          const categoryValue = brand.category;
          if (!categoryValue) return false;

          // Hvis category er en simpel tekst
          if (typeof categoryValue === 'string') {
            return categoryValue.trim().toLowerCase() === selectedCategoryId;
          }

          // Hvis category er et objekt (fx flere kategorier)
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

  // Henter brugerens favoritter og lytter på ændringer (live)
  // Så hjertet på hvert brand altid viser rigtigt
  useEffect(() => {
    const user = auth.currentUser;

    // Hvis ingen er logget ind, har vi ingen favoritter
    if (!user) {
      setFavoriteIds({});
      return;
    }

    const favoritesRef = ref(rtdb, `favorites/${user.uid}`);

    // onValue = live-lytning. UI opdateres automatisk når databasen ændrer sig
    const unsubscribe = onValue(favoritesRef, snapshot => {
      const data = snapshot.val() || {};
      setFavoriteIds(data);
    });

    return unsubscribe;
  }, []);

  // Når man trykker på hjertet: slå favorit til/fra i databasen
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
      return;
    }

    const favoriteRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    // Vi ændrer kun i databasen.
    // favoriteIds opdateres automatisk via onValue ovenfor.
    if (favoriteIds[brandId]) {
      remove(favoriteRef);     // fjern favorit
    } else {
      set(favoriteRef, true);  // tilføj favorit
    }
  };

  // Filtrér de brands vi viser ud fra søgeteksten
  const filteredBrands = brandsInCategory.filter(brand => {
    const query = searchQuery.trim().toLowerCase();

    // Hvis brugeren ikke har skrevet noget → vis alle brands i kategorien
    if (!query) return true;

    // Ellers: vis kun brands hvor titlen indeholder søgeordet
    const title = String(brand.title || '').toLowerCase();
    return title.includes(query);
  });

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      {/* Header med titel (kategorien) + tilbage + logout */}
      <AppHeader title={categoryTitle} showBack={true} showLogout={true} />

      {/* Søgefelt */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Søg i denne kategori…"
          value={searchQuery}
          onChangeText={setSearchQuery} // opdaterer searchQuery når man skriver
          style={styles.searchInput}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Hvis der slet ingen brands findes i kategorien */}
      {brandsInCategory.length === 0 && (
        <Text style={styles.emptyText}>
          Der er ingen brands i denne kategori endnu.
        </Text>
      )}

      {/* Hvis der findes brands, men søgningen giver 0 resultater */}
      {brandsInCategory.length > 0 && filteredBrands.length === 0 && (
        <Text style={styles.emptyText}>
          Ingen brands matcher din søgning.
        </Text>
      )}

      {/* Viser hvert brand som et kort */}
      {filteredBrands.map(brand => {
        const imageSource = localImagesByKey[brand.imageKey];
        if (!imageSource) return null;

        // Tjek om brandet er favorit for brugeren
        const isFavorite = !!favoriteIds[brand.id];

        return (
          <TouchableOpacity
            key={brand.id}
            style={styles.card}
            activeOpacity={0.8}
            // Tryk på kortet -> åbner brandets detaljeside
            onPress={() =>
              navigation.navigate('BrandDetail', {
                brandId: brand.id,
              })
            }
          >
            <Image source={imageSource} style={styles.image} resizeMode="cover" />

            {/* Mørkt lag så titel/ikon er lettere at se */}
            <View style={styles.overlay} />

            {/* Hjerte til favorit */}
            <FavoriteToggleComponent
              isFavorite={isFavorite}
              onPress={() => toggleFavorite(brand.id)}
            />

            {/* Brandets navn */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{brand.title}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
