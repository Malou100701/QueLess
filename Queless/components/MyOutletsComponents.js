// components/MyOutletsComponents.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ref, onValue, get, update, remove } from 'firebase/database';
import { auth, rtdb } from '../database/firebase';
import AppHeader from './AppHeaderComponent';
import styles from '../style/myoutlets.styles';
import { colors } from '../style/theme';

export default function MyOutletsContent() {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hent alle bookinger for nuværende bruger
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const bookingsRef = ref(rtdb, `myOutlets/${user.uid}`);

    const unsubscribe = onValue(
      bookingsRef,
      snapshot => {
        const data = snapshot.val() || {};
        const list = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        // Nyeste øverst
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setBookings(list);
        setLoading(false);
      },
      error => {
        console.log('Fejl ved hentning af billetter:', error);
        setBookings([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔹 Annuller en booking: træk bookedCount ned og slet billetten
  const handleCancelBooking = (booking) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Log ind', 'Du skal være logget ind for at annullere en booking.');
      return;
    }

    Alert.alert(
      'Annuller booking',
      'Er du sikker på, at du vil annullere denne tid?',
      [
        { text: 'Fortryd', style: 'cancel' },
        {
          text: 'Ja, annuller',
          style: 'destructive',
          onPress: async () => {
            try {
              // 1) Reference til tidsrummet i brands
              const slotRef = ref(
                rtdb,
                `brands/${booking.brandId}/sales/${booking.saleId}/timeSlots/${booking.slotId}`
              );

              const slotSnap = await get(slotRef);
              const slotData = slotSnap.val() || {};
              const currentBooked = slotData.bookedCount || 0;
              const newBooked = currentBooked > 0 ? currentBooked - 1 : 0;

              // Opdater bookedCount (men aldrig under 0)
              await update(slotRef, { bookedCount: newBooked });

              // 2) Slet selve billetten under myOutlets
              const bookingRef = ref(
                rtdb,
                `myOutlets/${user.uid}/${booking.id}`
              );
              await remove(bookingRef);

              Alert.alert('Booking annulleret', 'Din booking er nu annulleret.');
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
  };

  // Loader-state
  if (loading || bookings === null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
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

      {bookings.map(booking => (
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

          {!!booking.saleLocation && (
            <Text style={styles.line}>
              Lokation: {booking.saleLocation}
            </Text>
          )}

          {/* 🔹 Annuller-knap */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(booking)}
            >
              <Text style={styles.cancelButtonText}>Annuller booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
