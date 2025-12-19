import { useEffect, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, set, remove } from 'firebase/database';
import { rtdb, auth } from './../database/firebase';
import { localImagesByKey } from './../data/ImageBundle';
import styles, { CARD_WIDTH, CARD_SPACING } from './../style/imageSlider.styles';
import FavoriteToggleComponent from './FavoriteToggleComponent';

// Denne komponent viser alle brands som en vandret slider.
// Man kan swipe mellem kortene, trykke for at åbne et brand
// og like/unlike et brand med hjerte-ikonet.
export default function ImageSliderContent() {
  // Alle brands fra databasen
  const [brands, setBrands] = useState([]);

  // Favoritter for brugeren (brandId -> true)
  const [favoriteIds, setFavoriteIds] = useState({});

  const navigation = useNavigation();

  // Henter alle brands fra databasen og opdaterer automatisk hvis noget ændrer sig
  useEffect(() => {
    const brandsRef = ref(rtdb, 'brands');

    const unsubscribe = onValue(brandsRef, snapshot => {
      const data = snapshot.val() || {};

      // Laver brands-objektet om til en liste, så vi kan bruge map()
      const list = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      setBrands(list);
    });

    return unsubscribe;
  }, []);

  // Henter brugerens favoritter, så hjerterne vises korrekt
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

    return unsubscribe;
  }, []);

  // Skifter favorit-status for et brand
  const toggleFavorite = (brandId) => {
    const user = auth.currentUser;

    if (!user) {
      console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
      return;
    }

    const favoriteRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);

    // Hvis brandet allerede er favorit, fjernes det
    // Ellers tilføjes det som favorit
    if (favoriteIds[brandId]) {
      remove(favoriteRef);
    } else {
      set(favoriteRef, true);
    }
  };

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}

        // Gør at slideren stopper pænt ved hvert kort
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"

        contentContainerStyle={styles.scrollContent}
      >
        {brands.map(item => {
          const imageSource = localImagesByKey[item.imageKey];
          if (!imageSource) return null;

          // Tjek om dette brand er en favorit
          const isFavorite = !!favoriteIds[item.id];

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('BrandDetail', { brandId: item.id })
              }
            >
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
              />

              {/* Mørkt lag over billedet så tekst og ikoner er nemmere at se */}
              <View style={styles.overlay} />

              {/* Hjerte-knap til at like/unlike brandet */}
              <FavoriteToggleComponent
                isFavorite={isFavorite}
                onPress={() => toggleFavorite(item.id)}
              />

              {/* Brandets titel */}
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
