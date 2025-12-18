import { useEffect, useState } from 'react';
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

  //bruges til at åbne/lukke lagersalg/ altså med dropdown
  const [openSaleId, setOpenSaleId] = useState(null);

  // Alle bookinger for den nuværende bruger (liste)
  const [userBookings, setUserBookings] = useState([]);

  // Alert hvis brugeren prøver at booke samme lagersalg igen
  function showAlreadyBookedAlert() {
    Alert.alert(
      'Allerede booket',
      'Du kan kun booke ét tidsrum for dette lagersalg.'
    );
  }

  // Henter brand-data (realtid) fra "brands/{brandId}"
  useEffect(function () {
    const brandRef = ref(rtdb, 'brands/' + brandId);

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

    return unsubscribe;
  }, [brandId]);

  // Henter alle bookinger for nuværende bruger
  useEffect(function () {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUserBookings([]);
      return;
    }

    const bookingsRef = ref(rtdb, 'myOutlets/' + currentUser.uid);

    const unsubscribe = onValue(
      bookingsRef,
      function (snapshot) {
        const data = snapshot.val() || {};

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

        setUserBookings(list);
      },
      function (error) {
        console.log('Fejl ved hentning af bookinger:', error);
        setUserBookings([]);
      }
    );

    return unsubscribe;
  }, [brandId]);

  // Laver liste med lagersalg fra brand
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

  // Åbn/luk et lagersalg i UI
  function toggleSaleOpen(saleId) {
    if (openSaleId === saleId) {
      setOpenSaleId(null);
    } else {
      setOpenSaleId(saleId);
    }
  }

  // Tjek: har brugeren allerede en booking for dette brand + denne sale?
  function userHasBookingForSale(saleId) {
    for (let i = 0; i < userBookings.length; i++) {
      const booking = userBookings[i];

      // Samme brand + samme lagersalg
      if (booking.brandId === brandId && booking.saleId === saleId) {
        return true;
      }
    }
    return false;
  }

  // Booking-logik for ét tidsrum (slot) i ét lagersalg
  function handleBookSlot(sale, slot) {
    const currentUser = auth.currentUser;

    // Brugeren skal være logget ind
    if (!currentUser) {
      Alert.alert('Log ind', 'Du skal være logget ind for at booke.');
      return;
    }

    // Må kun have én booking pr. lagersalg for dette brand
    if (userHasBookingForSale(sale.id)) {
      showAlreadyBookedAlert();
      return;
    }

    const capacity = slot.capacity;
    const bookedCount = slot.bookedCount ? slot.bookedCount : 0;

    // Tjek om tidsrummet er udsolgt
    if (capacity != null && bookedCount >= capacity) {
      Alert.alert('Udsolgt', 'Dette tidsrum er udsolgt.');
      return;
    }

    const slotRef = ref(
      rtdb,
      'brands/' +
        brandId +
        '/sales/' +
        sale.id +
        '/timeSlots/' +
        slot.id
    );

    const newBookedCount = bookedCount + 1;

    //Opdaterer bookedCount på selve timeslottet
    update(slotRef, { bookedCount: newBookedCount })
      .then(function () {
        //Opretter booking under myOutlets/{userId}
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

  //Loading / fejlvisning
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
            // Bygger liste af tidsrum (timeSlots) for dette lagersalg
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

            // Har brugeren allerede en booking for dette brand + dette sale?
            const hasBookedThisSale = userHasBookingForSale(sale.id);

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

                {openSaleId === sale.id && (
                  <View style={styles.slotList}>
                    {timeSlots.map(function (slot) {
                      const capacity = slot.capacity;
                      const bookedCount = slot.bookedCount
                        ? slot.bookedCount
                        : 0;

                      const isSoldOut =
                        capacity != null && bookedCount >= capacity;

                      const disableForUser = hasBookedThisSale;

                      let remaining = null;
                      if (capacity != null) {
                        const diff = capacity - bookedCount;
                        remaining = diff > 0 ? diff : 0;
                      }

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

        <BrandMapComponent
          latitude={brand.latitude}
          longitude={brand.longitude}
          address={brand.address}
        />
      </View>
    </ScrollView>
  );
}
