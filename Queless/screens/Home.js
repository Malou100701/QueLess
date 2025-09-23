// src/screens/Home.js
import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../style/theme';

// Skærme
import CheckIn from './CheckIn';
import Favorites from './Favorites';
import Friends from './Friends';
import MyOutlets from './MyOutlets';

// Indhold til Hjem
import HomeContent from '../components/HomeComponent';

// Ikoner
import HomeIcon from '../assets/icons/Home.png';
import HeartIcon from '../assets/icons/heart.png';
import FriendsIcon from '../assets/icons/friends.png';
import CalendarIcon from '../assets/icons/calendar.png';
import QRIcon from '../assets/icons/QRcode.png';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Hjem: HomeIcon,
  Favorites: HeartIcon,
  CheckIn: QRIcon,
  Friends: FriendsIcon,
  MyOutlets: CalendarIcon,
};

function HomeScreen() {
  return <HomeContent />;
}

export default function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Hjem"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, size }) => (
          <Image source={TAB_ICONS[route.name]} style={{ width: size, height: size, tintColor: color }} resizeMode="contain" />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
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
