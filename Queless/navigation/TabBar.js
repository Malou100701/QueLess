// Josephine Holst-Christensen
// navigation/NavigationBar.js
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, headerStyling } from '../style/theme';

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
        headerStyle: { backgroundColor: colors.background  },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
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
      <Tab.Screen name="Hjem" component={Home} options={{ title: 'Hjem' }} />
      <Tab.Screen name="Favorites" component={Favorites} options={{ title: 'Favoritter' }} />
      <Tab.Screen name="CheckIn" component={CheckIn} options={{ title: 'Tjek ind' }} />
      <Tab.Screen name="Friends" component={Friends} options={{ title: 'Venner' }} />
      <Tab.Screen name="MyOutlets" component={MyOutlets} options={{ title: 'Mine tider' }} />
    </Tab.Navigator>
  );
}
