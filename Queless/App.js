import * as React from 'react';
import { Text, ScrollView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Skærme
import CheckIn from '../Queless/screens/CheckIn.js';
import Favorites from '../Queless/screens/Favorites.js';
import Friends from '../Queless/screens/Friends.js';
import MyOutlets from '../Queless/screens/MyOutlets.js';
import CreateUser from '../Queless/screens/CreateUser.js'; // hvis du vil tilføje den senere
import Login from '../Queless/screens/Login.js';           // hvis du vil tilføje den senere

// Ikoner (tilpas stierne hvis din App.js ligger et andet sted)
import HomeIcon from '../Queless/assets/icons/Home.png';
import HeartIcon from '../Queless/assets/icons/heart.png';
import FriendsIcon from '../Queless/assets/icons/friends.png';
import CalendarIcon from '../Queless/assets/icons/calendar.png';
import QRIcon from '../Queless/assets/icons/QRcode.png';

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
  CheckIn: QRIcon,       // eller CalendarIcon, hvis du foretrækker
  Friends: FriendsIcon,
  MyOutlets: CalendarIcon,
};

export default function App() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name="MyOutlets" component={MyOutlets} options={{ title: 'Mine lagersalg' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
