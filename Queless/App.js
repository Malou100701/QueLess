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
import NavigationBar from './navigation/TabBar'; // ← hvis filen hedder TabBar.js: './navigation/TabBar'

const Stack = createNativeStackNavigator();

export default function App() {
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
        <Stack.Screen name="Register" component={SignUp} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}