// screens/Category.js
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
import { rtdb } from '../database/firebase';
import { auth } from '../database/firebase';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/categoryscreen.styles';
import BackIcon from '../assets/icons/back.png';
import HeartOutline from '../assets/icons/heart-outline.png';
import HeartFilled from '../assets/icons/heart-filled.png';
import AppHeader from '../components/AppHeaderComponent';


export default function Category() {
    const route = useRoute();
    const navigation = useNavigation();
    const { categoryId, categoryTitle } = route.params;

    const [brands, setBrands] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState({}); // { brandId: true, ... }

    // Hent brands i den valgte kategori
    useEffect(() => {
        const brandsRef = ref(rtdb, 'brands');

        const unsub = onValue(
            brandsRef,
            snapshot => {
                const data = snapshot.val() || {};
                const list = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                }));

                const cid = String(categoryId).toLowerCase();

                const filtered = list.filter(b => {
                    const cat = b.category;
                    if (!cat) return false;

                    // category som streng ("tøj")
                    if (typeof cat === 'string') {
                        return cat.trim().toLowerCase() === cid;
                    }

                    // category som "array-agtigt" objekt {0:"tøj",1:"træning"}
                    if (typeof cat === 'object') {
                        const vals = Object.values(cat).map(v =>
                            String(v).trim().toLowerCase()
                        );
                        return vals.includes(cid);
                    }

                    return false;
                });

                setBrands(filtered);
            },
            error => {
                console.log('Firebase error:', error);
                setBrands([]);
            }
        );

        return () => unsub();
    }, [categoryId]);

    // Hent favoritter for logget ind bruger
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const favRef = ref(rtdb, `favorites/${user.uid}`);

        const unsubFav = onValue(favRef, snapshot => {
            const data = snapshot.val() || {};
            setFavoriteIds(data); // fx { bareen: true, baumUndPferdgarten: true }
        });

        return () => unsubFav();
    }, []);

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

    if (!brands) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (brands.length === 0) {
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

    return (
        <ScrollView style={styles.page} contentContainerStyle={styles.container}>
            <AppHeader
                title={categoryTitle}
                showBack={true}
                showLogout={true}   // eller false, hvis du ikke vil have logout her
            />

            {/* BRAND CARDS */}
            {brands.map(item => {
                const imageSource = localImagesByKey[item.imageKey];
                if (!imageSource) return null;

                const isFavorite = !!(favoriteIds && favoriteIds[item.id]);

                return (
                    <View key={item.id} style={styles.card}>
                        <Image source={imageSource} style={styles.image} resizeMode="cover" />
                        <View style={styles.overlay} />

                        {/* Favorit hjerte */}
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
        </ScrollView>
    );
}
