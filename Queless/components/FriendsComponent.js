import { View, Text, ScrollView } from 'react-native';
import styles from '../style/friends.styles';
import AppHeader from './AppHeaderComponent';

export default function FriendsContent() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="VENNER"
        uppercase={true}
        showLogout={true}
      />

      <View style={styles.centerWrapper}>
        <Text style={styles.comingSoon}>COMING SOON</Text>
      </View>
    </ScrollView>
  );
}
