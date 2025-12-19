// Denne komponent viser kategorierne på forsiden.
// Den bruges inde i Home-komponenten, så man kan trykke på en kategori og gå til dens side.

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../data/CategoryBundle';
import styles from '../style/category.styles';


export default function CategoryComponent() {
  // Giver adgang til navigation (så vi kan skifte side)
  const navigation = useNavigation();


   // Når man trykker på en kategori, går vi til "Category"-siden
  // og sender info med (id + titel), så den næste side ved hvad den skal vise
  const handlePress = (category) => {
    navigation.navigate('Category', {
      categoryId: category.categoryId,   
      categoryTitle: category.title,    
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePress(item)}
          >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
