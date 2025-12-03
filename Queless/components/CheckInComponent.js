// Malou Bjørnholt
import { ScrollView, Text } from 'react-native';
import styles from '../style/home.styles';
import AppHeader from './AppHeaderComponent';

export default function CheckInContent() {

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >

      <AppHeader
        title="Tjek ind"
        uppercase={true}
        showLogout={true}
      />
    </ScrollView>
  );
}
