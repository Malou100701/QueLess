// Malou Bjørnholt
// App.js
import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './database/firebase';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import NavigationBar from './navigation/TabBar';
import NavigationBarBusiness from './navigation/TabBar-Business';
import LoginBusiness from './screens/Login-Business';
import SignUpBusiness from './screens/SignUp-Business';
import Category from './screens/Category';

const Stack = createNativeStackNavigator();

export default function App() {

  // holder den nuværende bruger i lokal state. null = ingen er logget ind
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={NavigationBar} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="LoginBusiness" component={LoginBusiness} />
        <Stack.Screen name="SignUpBusiness" component={SignUpBusiness} />
        <Stack.Screen name="Home-Business" component={NavigationBarBusiness} />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{ title: '' }}   // header-tekst, vi bruger egen titel i screen
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}