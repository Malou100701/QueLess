//denne side bruges til at vise kategorierne på forsiden - den tages fat i i home komponenten, hvor den vises. 
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories } from '../data/CategoryBundle';
import styles from '../style/category.styles';


export default function CategoryComponent() {
  const navigation = useNavigation();

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
