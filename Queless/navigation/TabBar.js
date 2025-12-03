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

const TAB_ICONS = {
  Hjem: HomeIcon,
  Favorites: HeartIcon,
  CheckIn: QRIcon,
  Friends: FriendsIcon,
  MyOutlets: CalendarIcon,
};

// ⭐ mini-stack til Hjem-tabben
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
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
          letterSpacing: 1,
          color: colors.text,
        },
        headerTitleContainerStyle: { paddingLeft: 16 },

        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarIcon: ({ color, size }) => (
          <Image
            source={TAB_ICONS[route.name]}
            style={{ width: size, height: size, tintColor: color }}
            resizeMode="contain"
          />
        ),
      })}
    >
      {/* HJEM-tabben bruger nu HomeStackScreen */}
      <Tab.Screen
        name="Hjem"
        component={HomeStackScreen}
        options={{ title: 'Hjem', headerShown: false }}
      />

      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{ title: 'Favoritter' }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckIn}
        options={{ title: 'Mine Billet' }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{ title: 'Venner' }}
      />
      <Tab.Screen
        name="MyOutlets"
        component={MyOutlets}
        options={{ title: 'Mine tider' }}
      />
    </Tab.Navigator>
  );
}
