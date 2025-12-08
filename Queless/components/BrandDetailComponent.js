// components/BrandDetailComponent.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AppHeader from './AppHeaderComponent';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/branddetail.styles';
import { rtdb, auth } from '../database/firebase';
import {
  ref,
  onValue,
  update,
  push,
  set,
} from 'firebase/database';
import { colors } from '../style/theme';
import BrandMapComponent from './BrandMapComponent';

export default function BrandDetailContent({ brandId }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSaleId, setOpenSaleId] = useState(null);

  // 🆕 Brugeren har allerede booket?
  const [hasBookedThisBrand, setHasBookedThisBrand] = useState(false);

  // 🆕 Alert ved tryk på disabled knap
  const showDisabledAlert = () => {
    Alert.alert(
      "Allerede booket",
      "Du kan kun booke ét tidsrum pr. lagersalg."
    );
  };

  // --------------------------------------------------
  // HENT BRAND DATA
  // --------------------------------------------------
  useEffect(() => {
    const brandRef = ref(rtdb, `brands/${brandId}`);

    const unsub = onValue(
      brandRef,
      snapshot => {
        const data = snapshot.val();
        setBrand(data || null);
        setLoading(false);
      },
      error => {
        console.log('Error loading brand:', error);
        setBrand(null);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [brandId]);

  // --------------------------------------------------
  // TJEK BOOKING STATUS FOR DENNE BRUGER
  // --------------------------------------------------
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setHasBookedThisBrand(false);
      return;
    }

    const bookingsRef = ref(rtdb, `myOutlets/${currentUser.uid}`);

    const unsubscribe = onValue(bookingsRef, snapshot => {
      const data = snapshot.val() || {};
      const bookingsArray = Object.values(data);

      const alreadyBooked = bookingsArray.some(
        booking => booking.brandId === brandId
      );

      setHasBookedThisBrand(alreadyBooked);
    });

    return () => unsubscribe();
  }, [brandId]);

  // --------------------------------------------------
  // LAV LISTE AF LAGERSALG
  // --------------------------------------------------
  const salesList = useMemo(() => {
    if (!brand || !brand.sales) return [];
    return Object.entries(brand.sales).map(([id, sale]) => ({
      id,
      ...sale,
    }));
  }, [brand]);

  const toggleSaleOpen = saleId => {
    setOpenSaleId(prev => (prev === saleId ? null : saleId));
  };

  // --------------------------------------------------
  // BOOKING
  // --------------------------------------------------
  const handleBookSlot = (sale, slot) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert("Log ind", "Du skal være logget ind for at booke.");
      return;
    }

    // 🆕 Check om brugeren allerede har booket
    if (hasBookedThisBrand) {
      Alert.alert("Allerede booket", "Du har allerede booket et tidsrum.");
      return;
    }

    const capacity = slot.capacity;
    const bookedCount = slot.bookedCount || 0;

    // Udsolgt?
    if (capacity != null && bookedCount >= capacity) {
      Alert.alert("Udsolgt", "Dette tidsrum er udsolgt.");
      return;
    }

    // Firebase refs
    const slotRef = ref(
      rtdb,
      `brands/${brandId}/sales/${sale.id}/timeSlots/${slot.id}`
    );

    const newBookedCount = bookedCount + 1;

    // Opdater slot
    update(slotRef, { bookedCount: newBookedCount })
      .then(() => {
        const bookingsRef = ref(rtdb, `myOutlets/${currentUser.uid}`);
        const newBookingRef = push(bookingsRef);

        const bookingData = {
          brandId,
          brandTitle: brand.title,
          saleId: sale.id,
          saleDate: sale.date,
          saleLocation: sale.location || '',
          slotId: slot.id,
          slotStart: slot.start,
          slotEnd: slot.end,
          createdAt: Date.now(),
        };

        return set(newBookingRef, bookingData);
      })
      .then(() => {
        Alert.alert("Booking bekræftet", "Din tid er nu booket.");
      })
      .catch(error => {
        console.log("Booking fejl:", error);
        Alert.alert("Fejl", "Der opstod en fejl. Prøv igen senere.");
      });
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!brand) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text>Kunne ikke finde brand.</Text>
      </View>
    );
  }

  const imageSource = localImagesByKey[brand.imageKey];

  return (
    <ScrollView style={styles.page}>
      <View style={styles.container}>
        <AppHeader showBack={true} showLogout={true} />
      </View>

      {imageSource && (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.container}>
        {brand.title && <Text style={styles.title}>{brand.title}</Text>}

        {brand.description && (
          <Text style={styles.description}>{brand.description}</Text>
        )}

        {/* -------------------------------------------
            LAGERSALG
        -------------------------------------------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kommende lagersalg</Text>

          {salesList.length === 0 && (
            <Text style={styles.muted}>Der er ingen kommende lagersalg.</Text>
          )}

          {salesList.map(sale => {
            const timeSlots = sale.timeSlots
              ? Object.entries(sale.timeSlots).map(([id, slot]) => ({
                  id,
                  ...slot,
                }))
              : [];

            return (
              <View key={sale.id} style={styles.saleCard}>
                <TouchableOpacity
                  style={styles.saleHeader}
                  onPress={() => toggleSaleOpen(sale.id)}
                >
                  <View>
                    <Text style={styles.saleDate}>{sale.date}</Text>
                    {sale.location && (
                      <Text style={styles.saleLocation}>{sale.location}</Text>
                    )}
                  </View>

                  <Text style={styles.saleChevron}>
                    {openSaleId === sale.id ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {openSaleId === sale.id && (
                  <View style={styles.slotList}>
                    {timeSlots.map(slot => {
                      const capacity = slot.capacity;
                      const bookedCount = slot.bookedCount || 0;

                      const isSoldOut = capacity != null && bookedCount >= capacity;
                      const disableForUser = hasBookedThisBrand;

                      const remaining =
                        capacity != null ? Math.max(capacity - bookedCount, 0) : null;

                      // 👉 vælg style
                      let buttonStyle = styles.bookButton;

                      if (isSoldOut) {
                        buttonStyle = [styles.bookButton, styles.bookButtonSoldOut];
                      } else if (disableForUser) {
                        buttonStyle = [
                          styles.bookButton,
                          styles.bookButtonAlreadyBooked,
                        ];
                      }

                      return (
                        <View key={slot.id} style={styles.slotCard}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.slotTime}>
                              {slot.start} - {slot.end}
                            </Text>

                            {capacity != null && (
                              <Text style={styles.slotCapacity}>
                                Kapacitet: {capacity} ({remaining} ledige)
                              </Text>
                            )}
                          </View>

                          <TouchableOpacity
                            style={buttonStyle}
                            activeOpacity={isSoldOut || disableForUser ? 1 : 0.7}
                            onPress={() => {
                              if (isSoldOut) {
                                Alert.alert("Udsolgt", "Dette tidsrum er udsolgt.");
                                return;
                              }

                              if (disableForUser) {
                                showDisabledAlert();
                                return;
                              }

                              handleBookSlot(sale, slot);
                            }}
                          >
                            <Text style={styles.bookButtonText}>
                              {isSoldOut ? "Udsolgt" : "Book"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <BrandMapComponent
          latitude={brand.latitude}
          longitude={brand.longitude}
          address={brand.address}
        />
      </View>
    </ScrollView>
  );
}
