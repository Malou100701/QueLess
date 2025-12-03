// navigation/TabBar.js
import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../style/theme';

// Skærme
import Home from '../screens/Home';
import Category from '../screens/Category';
import CheckIn from '../screens/CheckIn';
import Favorites from '../screens/Favorites';
import Friends from '../screens/Friends';
import MyOutlets from '../screens/MyOutlets';

// Ikoner
import HomeIcon from '../assets/icons/Home.png';
import HeartIcon from '../assets/icons/heart.png';
import FriendsIcon from '../assets/icons/friends.png';
import CalendarIcon from '../assets/icons/calendar.png';
import QRIcon from '../assets/icons/QRcode.png';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

//  🔥 NØGLERNE SKAL MATCHE TAB-NAVNENE PRÆCIS 🔥
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
      <Tab.Screen name="Favoritter" component={Favorites} />
      <Tab.Screen name="Tjek ind" component={CheckIn} />
      <Tab.Screen name="Venner" component={Friends} />
      <Tab.Screen name="Mine tider" component={MyOutlets} />
    </Tab.Navigator>
  );
}
