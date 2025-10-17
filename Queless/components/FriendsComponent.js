// Malou Bjørnholt
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import styles from '../style/friends.styles';
import { FRIENDS } from '../data/Friends';

export default function FriendsContent() {
  const [query, setQuery] = useState('');

  // Filtrer venner baseret på søgning (case-insensitive)
  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FRIENDS;
    return FRIENDS.filter((name) => String(name).toLowerCase().includes(q));
  }, [query]);

  return (
    <View style={styles.container}>
      {/* Søgefelt */}
      <TextInput
        placeholder="Søg efter ven…"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          backgroundColor: '#fff',
          color: '#222',
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
          marginHorizontal: 16,
        }}
        placeholderTextColor="#888"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />

      <View style={styles.listWrapper}>
        <FlatList
          data={filteredFriends}
          keyExtractor={(item, i) => `${item}-${i}`}
          renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.itemText, { opacity: 0.6, textAlign: 'center', marginTop: 8 }]}>
              Ingen match på søgningen.
            </Text>
          }
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </View>
  );
}
