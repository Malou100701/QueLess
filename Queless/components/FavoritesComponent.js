import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { rtdb } from "../database/firebase";
import { ref, push, set, onValue } from "firebase/database";
import { colors } from '../style/theme'; // 👈 importér theme

export default function FavoritesContent() {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');

  const brandsRef = ref(rtdb, 'brands');

  // Live listener til Firebase
  useEffect(() => {
    const unsubscribe = onValue(brandsRef, (snapshot) => {
      const data = snapshot.val();
      setBrands(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);

  // Tilføj nyt brand
  const addBrand = () => {
    const trimmed = newBrand.trim();
    if (!trimmed) return;
    const newRef = push(brandsRef);
    set(newRef, trimmed);
    setNewBrand('');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background, // 🎨 fra theme
        padding: 20,
      }}
    >
      <TextInput
        placeholder="Skriv et brand"
        value={newBrand}
        onChangeText={setNewBrand}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
        placeholderTextColor={colors.muted}
      />

      <Button title="Tilføj" color={colors.brand} onPress={addBrand} />

      <FlatList
        data={brands}
        keyExtractor={(item, i) => `${item}-${i}`}
        renderItem={({ item }) => (
          <Text style={{ padding: 8, color: colors.text }}>{item}</Text>
        )}
      />
    </View>
  );
}
