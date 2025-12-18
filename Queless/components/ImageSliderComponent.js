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

export default function ImageSliderContent() {
    const [brands, setBrands] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState({});
    const navigation = useNavigation();

    // Henter alle brands fra firebase
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

    // Hent favoritter for nuværende bruger - så det kan ses på slide kortene
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

    // Skifter favorit-status for et brand
      const toggleFavorite = (brandId) => {
        const user = auth.currentUser;
        if (!user) {
          console.log('Ingen bruger logget ind – kan ikke ændre favoritter.');
          return;
        }
    
        const favoriteRef = ref(rtdb, `favorites/${user.uid}/${brandId}`);
    
        // Opdater både Firebase og lokal state
        setFavoriteIds(prev => {
          const updated = { ...prev };
    
          if (updated[brandId]) {
            // Hvis det allerede er favorit → fjern
            remove(favoriteRef);
            delete updated[brandId];
          } else {
            // Hvis det ikke er favorit → tilføj
            set(favoriteRef, true);
            updated[brandId] = true;
          }
          return updated;
        });
      };


    return (
        <View style={styles.sliderContainer}>
            <ScrollView
                horizontal // Gør ScrollView vandret i stedet for lodret (slider til siden)
                showsHorizontalScrollIndicator={false} // Skjuler den lille grå scroll-bar under slideren
                decelerationRate="fast" // Hastigheden ved scroll
                snapToInterval={CARD_WIDTH + CARD_SPACING} // Hvor langt der skal scrolles for hvert "snap"
                snapToAlignment="start"
                contentContainerStyle={styles.scrollContent} // Indre styling til ScrollView-indholdet
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
                            onPress={() =>
                                navigation.navigate('BrandDetail', { brandId: item.id })
                            }
                        >
                            <Image
                                source={imageSource}
                                style={styles.image}
                                resizeMode="cover"
                            />

                            {/* mørkt overlay over billedet */}
                            <View style={styles.overlay} />

                            {/* FavoriteToggleComponent er en genanvendelig komponent til favorit-hjertet.*/}
                            <FavoriteToggleComponent 
                                isFavorite={isFavorite}
                                onPress={() => toggleFavorite(item.id)}
                            />

                            {/* titel i midten af kortet */}
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View >
    );
}
