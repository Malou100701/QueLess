//Josephine Holst-Christensen
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { colors } from '../style/theme'; // importérer theme
import { rtdb } from "../database/firebase";
import { ref, push, set, onValue } from "firebase/database";

export default function FavoritesContent() {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState('');
  const [query, setQuery] = useState(''); // ← søgetekst

  const brandsRef = ref(rtdb, 'brands');

  // Live listener til Firebase
  useEffect(() => {
    const unsubscribe = onValue(brandsRef, (snapshot) => {
      const data = snapshot.val();
      setBrands(data ? Object.values(data) : []);
    });
    return () => unsubscribe();
  }, []);

  // Filtrer brands efter søgning (case-insensitive)
  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => String(b).toLowerCase().includes(q));
  }, [brands, query]);

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
        backgroundColor: colors.background, // fra theme
        padding: 20,
      }}
    >
      {/* Søgefelt */}
      <TextInput
        placeholder="Søg efter brand…"
        value={query}
        onChangeText={setQuery}
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
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      {/* Opret nyt brand */}
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
        data={filteredBrands}
        keyExtractor={(item, i) => `${item}-${i}`}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={{ padding: 8, color: colors.muted }}>
            {query ? 'Ingen match på søgningen.' : 'Ingen favoritter endnu.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Text style={{ padding: 8, color: colors.text }}>{item}</Text>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}
