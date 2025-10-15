// Josephine Holst-Christensen
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors} from '../style/theme';

// Skærme
import Home from '../screens/Home';            
import MyOutlets from '../screens/MyOutlets';

// Ikoner
import HomeIcon from '../assets/icons/Home.png';
import CalendarIcon from '../assets/icons/calendar.png';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Hjem: HomeIcon,
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
      <Tab.Screen name="MyOutlets" component={MyOutlets} options={{ title: 'Mine tider' }} />
    </Tab.Navigator>
  );
}
