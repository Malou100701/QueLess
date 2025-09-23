// screens/Home.js
import * as React from 'react';
import { Text, ScrollView, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Skærme (ligger i samme mappe)
import CheckIn from './CheckIn';
import Favorites from './Favorites';
import Friends from './Friends';
import MyOutlets from './MyOutlets';

// Ikoner (ligger i ../assets/icons/)
import HomeIcon from '../assets/icons/Home.png';
import HeartIcon from '../assets/icons/heart.png';
import FriendsIcon from '../assets/icons/friends.png';
import CalendarIcon from '../assets/icons/calendar.png';
import QRIcon from '../assets/icons/QRcode.png';

function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Hjemmeskærm</Text>
      <Text style={{ textAlign: 'center' }}>Brug fanerne i bunden for at navigere.</Text>
    </ScrollView>
  );
}

const Tab = createBottomTabNavigator();

// Map rutenavne -> ikonfil
const TAB_ICONS = {
  Hjem: HomeIcon,
  Favorites: HeartIcon,
  CheckIn: QRIcon,       // vælg QR eller Calendar til den fane du vil
  Friends: FriendsIcon,
  MyOutlets: CalendarIcon,
};

export default function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Hjem"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={TAB_ICONS[route.name]}
            style={{ width: size, height: size, tintColor: color }}
            resizeMode="contain"
          />
        ),
        tabBarActiveTintColor: '#0a7',
        tabBarInactiveTintColor: '#777',
      })}
    >
      <Tab.Screen name="Hjem" component={HomeScreen} options={{ title: 'Hjem' }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ title: 'Favoritter' }} />
      <Tab.Screen name="CheckIn" component={CheckIn} options={{ title: 'Tjek ind' }} />
      <Tab.Screen name="Friends" component={Friends} options={{ title: 'Venner' }} />
      <Tab.Screen name="MyOutlets" component={MyOutlets} options={{ title: 'Mine tider' }} />
    </Tab.Navigator>
  );
}
