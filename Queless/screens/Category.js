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
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../database/firebase';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/categoryscreen.styles';
import BackIcon from '../assets/icons/back.png'; //tilbage ikonet

export default function Category() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryTitle } = route.params;
  const [brands, setBrands] = useState(null);

useEffect(() => {
  const brandsRef = ref(rtdb, 'brands');

  const unsub = onValue(brandsRef, snapshot => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    const cid = String(categoryId).toLowerCase();

    const filtered = list.filter(b => {
      if (!b.category) return false;

      // category er et objekt med fx 0: "tøj", 1: "træning" 
      const cats = Object.values(b.category).map(c =>
        String(c).toLowerCase()
      );

      return cats.includes(cid);
    });

    setBrands(filtered);
  });

  return () => unsub();
}, [categoryId]);

  if (!brands) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (brands.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Der er ingen brands i denne kategori endnu.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      {/* HEADER med tilbage-knap */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{categoryTitle}</Text>

        {/* lille tom box så titlen ser centeret ud */}
        <View style={{ width: 24 }} />
      </View>

      {/* Cards for alle brands i kategorien */}
      {brands.map(item => {
        const imageSource = localImagesByKey[item.imageKey];
        if (!imageSource) return null;

        return (
          <View key={item.id} style={styles.card}>
            <Image source={imageSource} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
