import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../style/brandmap.styles';

/*
 Viser et kort med brandets placering og (hvis du giver lov) din afstand til brandet.
 */

// Regner afstanden i km mellem to koordinater med Haversine-formlen.
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
  // Gemmer din lokation (hvis vi får lov)
  const [userLocation, setUserLocation] = useState(null);

  // Viser loader mens vi prøver at hente din lokation
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Fejltekst hvis lokation ikke kan hentes
  const [locationErrorMessage, setLocationErrorMessage] = useState(null);

  // Hvis brandet ikke har koordinater, viser vi slet ikke kortet
  if (latitude == null || longitude == null) {
    return null;
  }

  // Sørger for at koordinaterne er tal
  const brandLatitude = parseFloat(latitude);
  const brandLongitude = parseFloat(longitude);

  // Henter brugerens lokation, når komponenten vises
  useEffect(() => {
    async function fetchUserLocation() {
      try {
        // Spørger om lov til at bruge lokation
        const result = await Location.requestForegroundPermissionsAsync();
        const status = result.status;

        if (status !== 'granted') {
          setLocationErrorMessage('Tilladelse til lokation blev ikke givet.');
          setIsLoadingLocation(false);
          return;
        }

        // Henter nuværende position
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

  // Teksten om afstand / fejlbesked under kortet
  let distanceText = null;

  // Hvis vi har brugerens lokation, så udregn afstand
  if (userLocation) {
    const distanceInKilometers = calculateDistanceInKilometers(
      userLocation.latitude,
      userLocation.longitude,
      brandLatitude,
      brandLongitude
    );

    let formattedDistance;

    // Under 1 km → vis meter
    if (distanceInKilometers < 1) {
      const meters = Math.round(distanceInKilometers * 1000);
      formattedDistance = meters + ' m';
    } else {
      formattedDistance = distanceInKilometers.toFixed(1) + ' km';
    }

    distanceText = 'Ca. ' + formattedDistance + ' fra dig';
  }

  // Vælger hvilken tekst vi viser under kortet (afstand eller fejl)
  let distanceLine = null;
  if (locationErrorMessage) {
    distanceLine = (
      <Text style={styles.infoDistance}>{locationErrorMessage}</Text>
    );
  } else if (distanceText) {
    distanceLine = (
      <Text style={styles.infoDistance}>{distanceText}</Text>
    );
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

        {/* Enten afstand eller fejl-besked */}
        {distanceLine}
      </View>
    </View>
  );
}
