// Josephine Holst-Christensen
import {View, Text, FlatList } from 'react-native';
import styles from '../style/favorite.styles';
import {BRANDS} from '../data/Favorites';


export default function FavoritesContent() {
  return (
   <View style={styles.container}>
      <View style={styles.listWrapper}>
        <FlatList
          data={BRANDS}
          keyExtractor={(item, i) => `${item}-${i}`}
          renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
