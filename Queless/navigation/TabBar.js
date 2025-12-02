// Josephine Holst-Christensen
// navigation/NavigationBar.js
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../style/theme';

// Skærme
import Home from '../screens/Home';
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
import logoutIcon from '../assets/icons/logout.png';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Hjem: HomeIcon,
  Favorites: HeartIcon,
  CheckIn: QRIcon,
  Friends: FriendsIcon,
  MyOutlets: CalendarIcon,
};

export default function NavigationBar() {
  return (
    <Tab.Navigator
      initialRouteName="Hjem"
      screenOptions={({ route }) => ({
        // HEADER
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 36,
          fontWeight: '800',
          letterSpacing: 2,
          color: colors.text,
        },
        headerTitleContainerStyle: {
          paddingLeft: 16,
        },

        // TAB BAR
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,

        // IKONER I TABBAR
        tabBarIcon: ({ color, size }) => (
          <Image
            source={TAB_ICONS[route.name]}
            style={{ width: size, height: size, tintColor: color }}
            resizeMode="contain"
          />
        ),
      })}
    >
      {/* HJEM – med logud-ikon i headerRight */}
      <Tab.Screen
        name="Hjem"
        component={Home}
        options={({ navigation }) => ({
          title: 'HJEM',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ marginRight: 16 }}
            >
              <Image
                source={logoutIcon}
                style={{ width: 22, height: 22 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{ title: 'FAVORITTER' }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckIn}
        options={{ title: 'MINE BILLET' }}
      />
      <Tab.Screen
        name="Friends"
        component={Friends}
        options={{ title: 'VENNER' }}
      />
      <Tab.Screen
        name="MyOutlets"
        component={MyOutlets}
        options={{ title: 'MINE TIDER' }}
      />
    </Tab.Navigator>
  );
}
