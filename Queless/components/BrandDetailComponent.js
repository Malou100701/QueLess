// components/BrandDetailComponent.js
import React, { useEffect, useState } from 'react';
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
import { ref, onValue, update, push, set } from 'firebase/database';
import BrandMapComponent from './BrandMapComponent';

export default function BrandDetailContent({ brandId }) {

  // Brand-data
  const [brand, setBrand] = useState(null);

  // Loader mens vi henter brand
  const [loading, setLoading] = useState(true);

  // Bruges til at holde styr på hvilket lagersalg der er åbent/dropdown
  const [openSaleId, setOpenSaleId] = useState(null);

  // Bruges til hvilke lagersalg brugeren allerede har booket
  const [bookedSaleIds, setBookedSaleIds] = useState({});

  // Viser en alert hvis bruger prøver at booke et lagersalg igen
  function showAlreadyBookedAlert() {
    Alert.alert(
      'Allerede booket',
      'Du kan kun booke ét tidsrum for dette lagersalg.'
    );
  }

  //Henter brand-data (realtid)
  useEffect(function () {
    const brandRef = ref(rtdb, 'brands/' + brandId);

    // onValue lytter til ændringer
    const unsubscribe = onValue(
      brandRef,
      function (snapshot) {
        const data = snapshot.val();
        if (data) {
          setBrand(data);
        } else {
          setBrand(null);
        }
        setLoading(false);
      },
      function (error) {
        console.log('Fejl ved hentning af brand:', error);
        setBrand(null);
        setLoading(false);
      }
    );

    // stopper med at lytte, når komponenten fjernes / når der åbnes op for en ny side
    return unsubscribe;
  }, [brandId]);

  // Kigger på brugerens bookinger og ser, hvilke lagersalg der allerede er booket
  useEffect(function () {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setBookedSaleIds({});
      return;
    }

    const bookingsRef = ref(rtdb, 'myOutlets/' + currentUser.uid);

    const unsubscribe = onValue(bookingsRef, function (snapshot) {
      const data = snapshot.val() || {};

      // Laver objekt om til liste af bookings
      const bookingsArray = [];
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        bookingsArray.push(data[key]);
      }

      // Bygger et objekt med alle saleId, brugeren har booket
      const saleIdMap = {};
      for (let j = 0; j < bookingsArray.length; j++) {
        const booking = bookingsArray[j];
        if (booking.saleId) {
          saleIdMap[booking.saleId] = true;
        }
      }

      // Nu ved vi: bookedSaleIds[saleId] === true → så betyder det at dette lagersalg er allerede booket
      setBookedSaleIds(saleIdMap);
    });

    return unsubscribe;
  }, [brandId]);

  //Laver en liste med lagersalg fra brand
  function buildSalesList(brandData) {
    const list = [];

    if (!brandData || !brandData.sales) {
      return list;
    }

    const salesObject = brandData.sales;
    const salesKeys = Object.keys(salesObject);

    for (let i = 0; i < salesKeys.length; i++) {
      const saleId = salesKeys[i];
      const saleData = salesObject[saleId];
      list.push({
        id: saleId,
        ...saleData,
      });
    }

    return list;
  }

  const salesList = buildSalesList(brand);

  // Skift om et lagersalg er åbent eller lukket (i dropdown)
  function toggleSaleOpen(saleId) {
    if (openSaleId === saleId) {
      setOpenSaleId(null);
    } else {
      setOpenSaleId(saleId);
    }
  }

  // Booking-logik for ét tidsrum (slot) i ét lagersalg 
  function handleBookSlot(sale, slot) {
    const currentUser = auth.currentUser;

    // Må kun have én booking pr. lagersalg (sale)
    if (bookedSaleIds[sale.id]) {
      // hvis denne bruger allerede har en booking med dette sale.id så vises alert
      showAlreadyBookedAlert();
      return;
    }

    const capacity = slot.capacity;
    const bookedCount = slot.bookedCount ? slot.bookedCount : 0;

    //Tjekker om tidsrummet er udsolgt
    if (capacity != null && bookedCount >= capacity) {
      Alert.alert('Udsolgt', 'Dette tidsrum er udsolgt.');
      return;
    }

    const slotRef = ref(
      rtdb,
      `brands/${brandId}/sales/${sale.id}/timeSlots/${slot.id}`
    );

    const newBookedCount = bookedCount + 1;

    //Først opdaterer vi bookedCount på slottet
    update(slotRef, { bookedCount: newBookedCount })
      .then(function () {
        //Derefter opretter vi booking under myOutlets/{userId}
        const bookingsRef = ref(rtdb, 'myOutlets/' + currentUser.uid);
        const newBookingRef = push(bookingsRef);

        const bookingData = {
          brandId: brandId,
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
      .then(function () {
        Alert.alert('Booking bekræftet', 'Din tid er nu booket.');
      })
      .catch(function (error) {
        console.log('Booking fejl:', error);
        Alert.alert('Fejl', 'Der opstod en fejl. Prøv igen senere.');
      });
  }

  // Loading / fejlvisning
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!brand) {
    return (
      <View style={styles.center}>
        <Text>Kunne ikke finde brand.</Text>
      </View>
    );
  }

  const imageSource = localImagesByKey[brand.imageKey];

  return (
    <ScrollView style={styles.page}>
      <View style={styles.headerContainer}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kommende lagersalg</Text>

          {salesList.length === 0 && (
            <Text style={styles.muted}>
              Der er ingen kommende lagersalg.
            </Text>
          )}

          {salesList.map(function (sale) {
            // Bygger liste af timeSlots (tidsrum) for dette lagersalg
            let timeSlots = [];
            if (sale.timeSlots) {
              const slotKeys = Object.keys(sale.timeSlots);
              for (let i = 0; i < slotKeys.length; i++) {
                const slotId = slotKeys[i];
                const slotData = sale.timeSlots[slotId];
                timeSlots.push({
                  id: slotId,
                  ...slotData,
                });
              }
            }

            //Har brugeren allerede booket dette konkrete lagersalg?
            const hasBookedThisSale = bookedSaleIds[sale.id] === true;

            return (
              <View key={sale.id} style={styles.saleCard}>
                <TouchableOpacity
                  style={styles.saleHeader}
                  onPress={function () {
                    toggleSaleOpen(sale.id);
                  }}
                >
                  <View>
                    <Text style={styles.saleDate}>{sale.date}</Text>
                    {sale.location && (
                      <Text style={styles.saleLocation}>{sale.location}</Text>
                    )}
                  </View>

                  <Text>
                    {openSaleId === sale.id ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {/* Hvis dette lagersalg er åbent → vis tidsrum */}
                {openSaleId === sale.id && (
                  <View style={styles.slotList}>
                    {timeSlots.map(function (slot) {
                      const capacity = slot.capacity;
                      const bookedCount = slot.bookedCount
                        ? slot.bookedCount
                        : 0;

                      const isSoldOut =
                        capacity != null && bookedCount >= capacity;

                      // Denne bruger må ikke booke flere tider for dette sale
                      const disableForUser = hasBookedThisSale;

                      let remaining = null;
                      if (capacity != null) {
                        const diff = capacity - bookedCount;
                        remaining = diff > 0 ? diff : 0;
                      }

                      // Vælg knap-style
                      let buttonStyle = styles.bookButton;
                      if (isSoldOut) {
                        buttonStyle = [
                          styles.bookButton,
                          styles.bookButtonSoldOut,
                        ];
                      } else if (disableForUser) {
                        buttonStyle = [
                          styles.bookButton,
                          styles.bookButtonAlreadyBooked,
                        ];
                      }

                      return (
                        <View key={slot.id} style={styles.slotCard}>
                          <View style={styles.slotInfo}>
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
                            activeOpacity={
                              isSoldOut || disableForUser ? 1 : 0.7
                            }
                            onPress={function () {
                              if (isSoldOut) {
                                Alert.alert(
                                  'Udsolgt',
                                  'Dette tidsrum er udsolgt.'
                                );
                                return;
                              }

                              if (disableForUser) {
                                showAlreadyBookedAlert();
                                return;
                              }

                              handleBookSlot(sale, slot);
                            }}
                          >
                            <Text style={styles.bookButtonText}>
                              {isSoldOut ? 'Udsolgt' : 'Book'}
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

        {/* Kort med brandets placering */}
        <BrandMapComponent
          latitude={brand.latitude}
          longitude={brand.longitude}
          address={brand.address}
        />
      </View>
    </ScrollView>
  );
}
