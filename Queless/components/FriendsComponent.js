// Malou Bjørnholt
import * as React from 'react';
import { ScrollView, View, Text, FlatList } from 'react-native';
import styles from '../style/friends.styles';
import {FRIENDS} from '../data/Friends';

export default function FriendsContent() {
  return (
   <View style={styles.container}>
         <View style={styles.listWrapper}>
           <FlatList
             data={FRIENDS}
             keyExtractor={(item, i) => `${item}-${i}`}
             renderItem={({ item }) => <Text style={styles.itemText}>{item}</Text>}
             ItemSeparatorComponent={() => <View style={styles.separator} />}
             showsVerticalScrollIndicator={false}
           />
         </View>
       </View>
  );
}
