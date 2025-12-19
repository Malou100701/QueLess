// Denne side viser en “billet” for en booking.
// Brugeren kommer typisk hertil efter at have booket et tidsrum,
// og her kan de se en QR-kode som kan scannes ved indgangen.

import { View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AppHeader from './AppHeaderComponent';
import QRcodeComponent from './QRcodeComponent';
import styles from '../style/ticketdetail.styles';

export default function TicketDetailComponent() {
  // useRoute giver adgang til data, som er sendt med navigation
  const route = useRoute();

  // Her henter vi booking-objektet, som blev sendt fra den forrige side
  const { booking } = route.params;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>

      {/* Header øverst på siden med titel, tilbageknap og logout */}
      <AppHeader
        title="QR-kode"
        showBack={true}
        showLogout={true}
        uppercase={false}
      />

      {/* Wrapper der hjælper med placering af QR-koden */}
      <View style={styles.qrWrapper}>

        {/* Kort/boks som giver et pænt visuelt layout */}
        <View style={styles.card}>

          {/* Viser QR-koden baseret på booking-data */}
          <QRcodeComponent booking={booking} />
        </View>
      </View>
    </ScrollView>
  );
}
