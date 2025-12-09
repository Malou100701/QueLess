// components/MyOutletsComponents.js
import React, { useEffect, useState } from 'react';
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

export default function MyOutletsContent() {
  // Liste med bookinger for den nuværende bruger
  const [bookings, setBookings] = useState([]);

  // Henter alle bookinger for den bruger som er logget ind
  useEffect(function () {
    const user = auth.currentUser;

    if (!user) {
      setBookings([]);
      return;
    }

    const bookingsRef = ref(rtdb, 'myOutlets/' + user.uid);

    const unsubscribe = onValue(
      bookingsRef,
      function (snapshot) {
        const data = snapshot.val() || {};

        // Laver objektet om til en liste med id + data
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

        // Sortérer så de nyeste bookinger (højeste createdAt), så de kommer først
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

    return unsubscribe;
  }, []);

  // Annuller en booking:
  // først så opdateres bookedCount i timeslottet,
  // så slettes billetten under myOutlets/{userId}/{bookingId}
  // --------------------------------------------------
  async function cancelBookingInDatabase(userId, booking) {
    // Reference til timeslottet for denne booking
    const slotRef = ref(
      rtdb,
      'brands/' +
      booking.brandId +
      '/sales/' +
      booking.saleId +
      '/timeSlots/' +
      booking.slotId
    );

    // Henter nuværende bookedCount
    const slotSnap = await get(slotRef);
    const slotData = slotSnap.val() || {};
    const currentBooked = slotData.bookedCount ? slotData.bookedCount : 0;
    const newBooked = currentBooked > 0 ? currentBooked - 1 : 0; // aldrig under 0

    // Opdater bookedCount
    await update(slotRef, { bookedCount: newBooked });

    //Sletter billetten under myOutlets
    const bookingRef = ref(
      rtdb,
      'myOutlets/' + userId + '/' + booking.id
    );
    await remove(bookingRef);
  }

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
                'Der skete en fejl under annullering. Prøv igen om lidt.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.container}>
      <AppHeader
        title="mine tider"
        uppercase={true}
        showLogout={true}
      />

      {bookings.length === 0 && (
        <Text style={styles.emptyText}>
          Du har ingen bookede tider endnu.
        </Text>
      )}

      {bookings.length > 0 && (
        <Text style={styles.sectionTitle}>Kommende</Text>
      )}

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

            {booking.saleLocation ? (
              <Text style={styles.line}>
                Lokation: {booking.saleLocation}
              </Text>
            ) : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={function () {
                  handleCancelBooking(booking);
                }}
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
