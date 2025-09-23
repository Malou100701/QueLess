import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';

// tab-navigationen 
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        {/* Home er din bundmenu fra screens/Home.js */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // skjul ekstra header over tabs
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


