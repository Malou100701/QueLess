import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../style/brandmap.styles';

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
  // Brugerens nuværende position
  const [userLocation, setUserLocation] = useState(null);

  // Om vi stadig henter lokation
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Fejltekst hvis lokation ikke kan hentes
  const [locationErrorMessage, setLocationErrorMessage] = useState(null);

  // Hvis brandet ikke har koordinater, viser vi ikke kortet
  if (latitude == null || longitude == null) return null;

  // Sørg for at koordinaterne er tal
  const brandLatitude = parseFloat(latitude);
  const brandLongitude = parseFloat(longitude);

  // Hent brugerens lokation, når komponenten vises
  useEffect(() => {
    async function fetchUserLocation() {
      try {
        // Spørg om lov til at bruge lokation
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

  // Hvor kortet skal være centreret (brandets placering)
  const initialMapRegion = {
    latitude: brandLatitude,
    longitude: brandLongitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Tekst som "Ca. 450 m fra dig" eller "Ca. 2.3 km fra dig"
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
          // Viser blå prik for brugeren (hvis vi har lokation)
          showsUserLocation={true}
        >
          {/* Markør for brandets placering */}
          <Marker
            coordinate={{ latitude: brandLatitude, longitude: brandLongitude }}
            title={title}
            description={address}
          />
        </MapView>

        {/* Loader mens vi finder brugerens position */}
        {isLoadingLocation && (
          <View style={styles.locationLoader}>
            <ActivityIndicator size="small" />
          </View>
        )}
      </View>

      {/* Tekst under kortet */}
      <View style={styles.infoContainer}>
        {address && <Text style={styles.infoAddress}>{address}</Text>}

        {/* Vis enten afstand eller fejlbesked */}
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