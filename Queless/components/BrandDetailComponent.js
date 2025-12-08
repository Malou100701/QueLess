// components/BrandDetailComponent.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import AppHeader from './AppHeaderComponent';
import { localImagesByKey } from '../data/ImageBundle';
import styles from '../style/branddetail.styles';
import { rtdb } from '../database/firebase';
import { ref, onValue } from 'firebase/database';
import { colors } from '../style/theme';
import BrandMapComponent from './BrandMapComponent';

export default function BrandDetailContent({ brandId }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSaleId, setOpenSaleId] = useState(null);

  // Hent brand-data
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

  // Memoize liste af lagersalg
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

  if (loading) {
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

  if (!brand) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Kunne ikke finde brandet.</Text>
      </View>
    );
  }

  const imageSource = localImagesByKey[brand.imageKey];

  return (
    // ⬇️ ingen contentContainerStyle – vi styrer selv padding med View
    <ScrollView style={styles.page}>
      {/* Header i egen container med padding */}
      <View style={styles.container}>
        <AppHeader
          showBack={true}
          showLogout={true}
        />
      </View>

      {/* Billede direkte i ScrollView → kan gå kant-til-kant */}
      {imageSource && (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      )}

      {/* Resten af indholdet i container med padding */}
      <View style={styles.container}>
        {/* Titel over beskrivelsen */}
        {brand.title && (
          <Text style={styles.title}>{brand.title}</Text>
        )}

        {/* Beskrivelse */}
        {brand.description && (
          <Text style={styles.description}>{brand.description}</Text>
        )}

        {/* Lagersalg-sektion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kommende lagersalg</Text>

          {salesList.length === 0 && (
            <Text style={styles.muted}>
              Der er endnu ikke oprettet lagersalg for dette brand.
            </Text>
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
                {/* Dropdown header */}
                <TouchableOpacity
                  style={styles.saleHeader}
                  onPress={() => toggleSaleOpen(sale.id)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.saleDate}>{sale.date}</Text>
                    {sale.location && (
                      <Text style={styles.saleLocation}>{sale.location}</Text>
                    )}
                  </View>

                  <Text style={styles.saleChevron}>
                    {openSaleId === sale.id ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {/* TIDSSLIDER – kun synlig hvis åbnet */}
                {openSaleId === sale.id && (
                  <>
                    {timeSlots.length === 0 ? (
                      <Text style={styles.muted}>
                        Ingen tidsintervaller oprettet endnu.
                      </Text>
                    ) : (
                      <View style={styles.slotList}>
                        {timeSlots.map(slot => (
                          <View key={slot.id} style={styles.slotCard}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.slotTime}>
                                {slot.start} - {slot.end}
                              </Text>

                              {slot.capacity != null && (
                                <Text style={styles.slotCapacity}>
                                  Kapacitet: {slot.capacity}
                                </Text>
                              )}
                            </View>

                            {/* BOOK KNAP */}
                            <TouchableOpacity
                              style={styles.bookButton}
                              onPress={() =>
                                console.log(
                                  'BOOKING →',
                                  brandId,
                                  sale.id,
                                  slot.id
                                )
                              }
                            >
                              <Text style={styles.bookButtonText}>Book</Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>

        <BrandMapComponent
          latitude={brand.latitude}
          longitude={brand.longitude}
          title={brand.title}
          address={brand.address}
        />
      </View>
    </ScrollView>
  );
}
