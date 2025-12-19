/* Denne fil bruges til at vise detaljer om et brand og dets kommende lagersalg.
 Brugeren kan se information, åbne lagersalg og booke et tidsrum.
 Siden sørger for, at man ikke kan booke det samme lagersalg flere gange.
 */
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
  // Gemmer information om brandet, så vi kan vise det på siden og opdatere det, når data ændrer sig
  const [brand, setBrand] = useState(null);

  // Bruges til at vise en loader, så brugeren kan se at siden er i gang med at hente data
  const [loading, setLoading] = useState(true);

  //bruges til at åbne/lukke lagersalg/ altså med dropdown i UI
  const [openSaleId, setOpenSaleId] = useState(null);

  // Her gemmer vi alle tider som brugeren allerede har booket,
  // så vi kan stoppe dem fra at booke den samme igen.
  const [userBookings, setUserBookings] = useState([]);

  // Alert hvis brugeren prøver at booke samme lagersalg igen
  function showAlreadyBookedAlert() {
    Alert.alert(
      'Allerede booket',
      'Du kan kun booke ét tidsrum for dette lagersalg.'
    );
  }

  // Når siden åbner (eller brandId ændrer sig),
  // så henter vi brandets information fra databasen.
  useEffect(function () {
    const brandRef = ref(rtdb, 'brands/' + brandId);

    // Vi “lytter” på brandet, så hvis data ændrer sig i databasen,
    // så opdaterer siden sig automatisk.
    const unsubscribe = onValue(
      brandRef,
      function (snapshot) {
        const data = snapshot.val();

        // Gemmer data i brand-variablen (så vi kan vise det)
        if (data) {
          setBrand(data);
        } else {
          setBrand(null);
        }

        // Nu er vi færdige med at vente på data
        setLoading(false);
      },
      function (error) {
        console.log('Fejl ved hentning af brand:', error);
        setBrand(null);
        setLoading(false);
      }
    );

    // Når man forlader siden, stopper vi med at lytte på databasen
    return unsubscribe;
  }, [brandId]);

  // Når siden åbner, henter vi også brugerens bookinger.
  // Det gør vi for at kunne tjekke “har brugeren allerede booket?”
  useEffect(function () {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUserBookings([]);
      return;
    }

    const bookingsRef = ref(rtdb, 'myOutlets/' + currentUser.uid);

    // Vi “lytter” til brugerens bookinger i databasen.
    // Det betyder: hvis brugeren booker noget (eller sletter noget) så opdaterer siden sig selv automatisk.
    const unsubscribe = onValue(
      bookingsRef,
      function (snapshot) {
        // snapshot = et øjebliksbillede af data lige nu
        // .val() = selve indholdet (brandets info)
        const data = snapshot.val() || {};

        // Laver objektet om til en liste med id + data (lettest at arbejde med i React)
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

    // Stop lytningen når man forlader siden
    return unsubscribe;
  }, [brandId]);

  // Lagersalg i databasen ligger som et objekt, men vi vil have en liste for at kunne .map() over den.
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

  // Liste over kommende lagersalg vi viser i UI
  const salesList = buildSalesList(brand);

  // Åbn/luk i forhold til toggle/dropdown for et lagersalg i UI
  function toggleSaleOpen(saleId) {
    if (openSaleId === saleId) {
      setOpenSaleId(null);
    } else {
      setOpenSaleId(saleId);
    }
  }

  // Tjek: har brugeren allerede en booking for dette brand + dette lagersalg?
  function userHasBookingForSale(saleId) {
    // Ser om der findes en booking som matcher både dette brand og dette sale
    for (let i = 0; i < userBookings.length; i++) {
      const booking = userBookings[i];

      // Samme brand + samme lagersalg
      if (booking.brandId === brandId && booking.saleId === saleId) {
        return true;
      }
    }
    return false;
  }

  // Når brugeren trykker "Book" på et bestemt tidspunkt
  function handleBookSlot(sale, slot) {
    const currentUser = auth.currentUser;  // Finder den bruger der er logget ind lige nu


    // (1) Brugeren skal være logget ind
    if (!currentUser) {
      Alert.alert('Log ind', 'Du skal være logget ind for at booke.');
      return;
    }

    // 2) Vi tjekker om brugeren allerede har booket dette lagersalg før
    // (vi vil ikke tillade at booke flere tider til samme lagersalg)
    if (userHasBookingForSale(sale.id)) {
      showAlreadyBookedAlert();
      return;
    }


    // 3) Nu tjekker vi om der stadig er plads på dette tidspunkt
    // capacity = hvor mange der max må booke denne tid
    // bookedCount = hvor mange der allerede har booket
    const capacity = slot.capacity;
    const bookedCount = slot.bookedCount ? slot.bookedCount : 0;

    // Hvis bookedCount er lig med (eller større end) capacity, så er det udsolgt
    if (capacity != null && bookedCount >= capacity) {
      Alert.alert('Udsolgt', 'Dette tidsrum er udsolgt.');
      return;
    }

    // 4) Her laver vi en “adresse” til præcis dette tidspunkt i databasen.
    // Det er ligesom en sti til den rigtige mappe i et filsystem:
    // brands -> brandId -> sales -> saleId -> timeSlots -> slotId
    // Vi skal bruge den adresse, fordi vi vil opdatere bookedCount derinde.
    const slotRef = ref(
      rtdb,
      'brands/' +
      brandId +
      '/sales/' +
      sale.id +
      '/timeSlots/' +
      slot.id
    );


    // 5) Vi regner ud hvad bookedCount skal være efter bookingen
    // (vi lægger 1 til, fordi der er én ny booking)
    const newBookedCount = bookedCount + 1;

    // Vi gør to ting ved en booking:
    // A) Opdater bookedCount på slottet (så vi kan se hvor fyldt det er)
    // B) Gem en booking under brugeren (så vi kan se hvad brugeren har booket)
    update(slotRef, { bookedCount: newBookedCount })
      .then(function () {
        // B) Gem booking under myOutlets/{userId}
        const bookingsRef = ref(rtdb, 'myOutlets/' + currentUser.uid);
        // push() laver et nyt unikt booking-id automatisk
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

        // set() gemmer bookingData på det nye id
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
