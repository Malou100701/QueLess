import { View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AppHeader from './AppHeaderComponent';
import QRcodeComponent from './QRcodeComponent';
import styles from '../style/ticketdetail.styles';

export default function TicketDetailComponent() {
  const route = useRoute();
  const { booking } = route.params;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="QR-kode"
        showBack={true}      
        showLogout={true}
        uppercase={false}
      />

      <View style={styles.qrWrapper}>
        <View style={styles.card}>
          <QRcodeComponent booking={booking} />
        </View>
      </View>
    </ScrollView>
  );
}
