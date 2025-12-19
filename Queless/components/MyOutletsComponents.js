/*
 Denne side viser brugerens bookede tider (“Mine tider”).
 Man kan se detaljer, åbne en billet og annullere en booking.
 Ved annullering opdaterer siden også antallet af pladser på tidsrummet i databasen.
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ref, onValue, get, update, remove } from 'firebase/database';
import { auth, rtdb } from '../database/firebase';
import AppHeader from './AppHeaderComponent';
import styles from '../style/myoutlets.styles';
import { useNavigation } from '@react-navigation/native';   // 🔹 tilføjet

export default function MyOutletsContent() {
  // Her gemmer vi alle bookinger (tider) for den bruger der er logget ind
  const [bookings, setBookings] = useState([]);

  // Bruges til at gå til andre sider (fx “Vis billet”)
  const navigation = useNavigation();

  // Når siden åbner, henter vi brugerens bookede tider fra databasen
  useEffect(function () {
    const user = auth.currentUser;

    // Hvis ingen er logget ind, viser vi ingen bookinger
    if (!user) {
      setBookings([]);
      return;
    }

    // Stien i databasen hvor brugerens bookinger ligger
    const bookingsRef = ref(rtdb, 'myOutlets/' + user.uid);

    // Vi “lytter” på bookingerne,
    // så listen opdateres automatisk hvis noget ændrer sig
    const unsubscribe = onValue(
      bookingsRef,
      function (snapshot) {
        const data = snapshot.val() || {};

        // Databasen giver et objekt → vi laver det om til en liste
        const list = [];
        const keys = Object.keys(data);

        for (let i = 0; i < keys.length; i++) {
          const id = keys[i];
          const value = data[id];

          list.push({
            id: id,
            ...value,
          });
        }

        // Sorterer bookinger så de nyeste vises øverst
        list.sort(function (a, b) {
          const timeA = a.createdAt || 0;
          const timeB = b.createdAt || 0;
          return timeB - timeA;
        });

        setBookings(list);
      },
      function (error) {
        console.log('Fejl ved hentning af billetter:', error);
        setBookings([]);
      }
    );

    // Stopper lytningen når man forlader siden
    return unsubscribe;
  }, []);

  // Denne funktion annullerer en booking i databasen
  async function cancelBookingInDatabase(userId, booking) {
    // Finder det præcise tidsrum som bookingen hører til
    const slotRef = ref(
      rtdb,
      'brands/' +
        booking.brandId +
        '/sales/' +
        booking.saleId +
        '/timeSlots/' +
        booking.slotId
    );

    // Henter hvor mange der allerede har booket dette tidsrum
    const slotSnap = await get(slotRef);
    const slotData = slotSnap.val() || {};
    const currentBooked = slotData.bookedCount || 0;

    // Vi trækker 1 fra (men aldrig under 0)
    const newBooked = currentBooked > 0 ? currentBooked - 1 : 0;

    // Opdaterer bookedCount i databasen
    await update(slotRef, { bookedCount: newBooked });

    // Sletter selve bookingen fra brugerens liste
    const bookingRef = ref(
      rtdb,
      'myOutlets/' + userId + '/' + booking.id
    );
    await remove(bookingRef);
  }

  // Viser en popup og spørger om brugeren er sikker på annullering
  function handleCancelBooking(booking) {
    const user = auth.currentUser;

    Alert.alert(
      'Annuller booking',
      'Er du sikker på, at du vil annullere denne tid?',
      [
        { text: 'Fortryd', style: 'cancel' },
        {
          text: 'Ja, annuller',
          style: 'destructive',
          onPress: async function () {
            try {
              await cancelBookingInDatabase(user.uid, booking);
              Alert.alert(
                'Booking annulleret',
                'Din booking er nu annulleret.'
              );
            } catch (err) {
              console.log('Fejl ved annullering:', err);
              Alert.alert(
                'Fejl',
                'Der skete en fejl. Prøv igen senere.'
              );
            }
          },
        },
      ]
    );
  }

  // Når brugeren trykker “Vis billet”
  function handleShowTicket(booking) {
    // Vi sender booking-data med til den næste side
    navigation.navigate('TicketDetail', {
      booking: booking,
    });
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader title="mine tider" uppercase={true} showLogout={true} />

      {/* Hvis der ingen bookinger er */}
      {bookings.length === 0 && (
        <Text style={styles.emptyText}>
          Du har ingen bookede tider endnu.
        </Text>
      )}

      {bookings.length > 0 && (
        <Text style={styles.sectionTitle}>Kommende</Text>
      )}

      {/* Viser hver booking som et kort */}
      {bookings.map(function (booking) {
        return (
          <View key={booking.id} style={styles.card}>
            <Text style={styles.brandTitle}>
              {booking.brandTitle || 'Ukendt brand'}
            </Text>

            <Text style={styles.line}>
              Dato: {booking.saleDate || '-'}
            </Text>

            <Text style={styles.line}>
              Tid: {booking.slotStart} - {booking.slotEnd}
            </Text>

            {booking.saleLocation && (
              <Text style={styles.line}>
                Lokation: {booking.saleLocation}
              </Text>
            )}

            <View style={styles.buttonRow}>
              {/* Gå til billet-siden */}
              <TouchableOpacity
                style={styles.ticketButton}
                onPress={() => handleShowTicket(booking)}
              >
                <Text style={styles.ticketButtonText}>
                  Vis billet
                </Text>
              </TouchableOpacity>

              {/* Annuller booking */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(booking)}
              >
                <Text style={styles.cancelButtonText}>
                  Annuller booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}