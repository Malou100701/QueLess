// navigation/TabBar.js
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../style/theme';

// Skærme
import Home from '../screens/Home';
import Category from '../screens/SpecificCategory';
import CheckIn from '../screens/CheckIn';
import Favorites from '../screens/Favorites';
import Friends from '../screens/Friends';
import MyOutlets from '../screens/MyOutlets';
import BrandDetail from '../screens/BrandDetail';

// Ikoner
import HomeIcon from '../assets/icons/Home.png';
import HeartIcon from '../assets/icons/heart.png';
import FriendsIcon from '../assets/icons/friends.png';
import CalendarIcon from '../assets/icons/calendar.png';
import QRIcon from '../assets/icons/QRcode.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Hjem: HomeIcon,
  Favoritter: HeartIcon,
  'Tjek ind': QRIcon,
  Venner: FriendsIcon,
  'Mine tider': CalendarIcon,
};

// mini-stack til Hjem-tabben
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="BrandDetail" component={BrandDetail} />
    </Stack.Navigator>
  );
}

// 🔹 mini-stack til Favoritter-tabben
function FavoritesStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Første skærm i stacken er selve Favorit-siden */}
      <Stack.Screen name="FavoritesMain" component={Favorites} />
      {/* Samme BrandDetail som i HomeStack */}
      <Stack.Screen name="BrandDetail" component={BrandDetail} />
    </Stack.Navigator>
  );
}

export default function NavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName="Hjem"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarIcon: ({ color, size }) => {
          const iconSource = TAB_ICONS[route.name];
          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
      })}
    >
      <Tab.Screen name="Hjem" component={HomeStackScreen} />
      <Tab.Screen name="Favoritter" component={FavoritesStackScreen} />
      <Tab.Screen name="Tjek ind" component={CheckIn} />
      <Tab.Screen name="Venner" component={Friends} />
      <Tab.Screen name="Mine tider" component={MyOutlets} />
    </Tab.Navigator>
  );
}
