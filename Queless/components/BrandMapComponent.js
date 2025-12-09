import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../style/brandmap.styles';

//
// Standard Haversine-implementering (som i mange eksempler online):
// Beregner luftlinie-afstand i kilometer mellem to punkter på jorden
//
function calculateDistanceInKilometers(
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude
) {
  const earthRadiusInKilometers = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;

  const latitudeDifference = toRadians(endLatitude - startLatitude);
  const longitudeDifference = toRadians(endLongitude - startLongitude);

  const startLatitudeInRadians = toRadians(startLatitude);
  const endLatitudeInRadians = toRadians(endLatitude);

  const haversineValue =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(startLatitudeInRadians) *
      Math.cos(endLatitudeInRadians) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const angleBetweenPoints =
    2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue));

  return earthRadiusInKilometers * angleBetweenPoints;
}

export default function BrandMapComponent({
  latitude,
  longitude,
  title,
  address,
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationErrorMessage, setLocationErrorMessage] = useState(null);

  // Hvis brandet ikke har koordinater, giver det ingen mening at vise kortet
  if (latitude == null || longitude == null) return null;

  // Hvis de kommer som strings, laver vi dem om til tal
  const brandLatitude = parseFloat(latitude);
  const brandLongitude = parseFloat(longitude);

  useEffect(() => {
    async function fetchUserLocation() {
      try {
        // Bed om tilladelse til lokation (Expo anbefaler dette mønster)
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setLocationErrorMessage('Tilladelse til lokation blev ikke givet.');
          setIsLoadingLocation(false);
          return;
        }

        // Hent nuværende position
        const position = await Location.getCurrentPositionAsync({});

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      } catch (error) {
        setLocationErrorMessage('Kunne ikke hente din lokation.');
        setIsLoadingLocation(false);
      }
    }

    fetchUserLocation();
  }, []);

  // Kortet centreres omkring brandets placering
  const initialMapRegion = {
    latitude: brandLatitude,
    longitude: brandLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Tekst: "Ca. X km fra dig"
  let distanceText = null;

  if (userLocation) {
    const distanceInKilometers = calculateDistanceInKilometers(
      userLocation.latitude,
      userLocation.longitude,
      brandLatitude,
      brandLongitude
    );

    const formattedDistance =
      distanceInKilometers < 1
        ? `${Math.round(distanceInKilometers * 1000)} m`
        : `${distanceInKilometers.toFixed(1)} km`;

    distanceText = `Ca. ${formattedDistance} fra dig`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={initialMapRegion}
          showsUserLocation={true} // anbefalet i Expo/React Native Maps eksempler
        >
          {/* Brandets placering */}
          <Marker
            coordinate={{ latitude: brandLatitude, longitude: brandLongitude }}
            title={title}
            description={address}
          />
        </MapView>

        {/* Loader mens vi henter brugerens placering */}
        {isLoadingLocation && (
          <View
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>

      {/* Info under kortet */}
      <View style={styles.infoContainer}>
        {title && <Text style={styles.infoTitle}>{title}</Text>}
        {address && <Text style={styles.infoAddress}>{address}</Text>}

        {distanceText && !locationErrorMessage && (
          <Text style={styles.infoDistance}>{distanceText}</Text>
        )}

        {locationErrorMessage && (
          <Text style={styles.infoDistance}>{locationErrorMessage}</Text>
        )}
      </View>
    </View>
  );
}
