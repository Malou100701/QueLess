import * as React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importér dine skærme (tjek stier/filnavne og at de har default export)
import CheckIn from '../Queless/screens/CheckIn.js';
import CreateUser from '../Queless/screens/CreateUser.js';
import Favorites from '../Queless/screens/Favorites.js';
import Friends from '../Queless/screens/Friends.js';
import Login from '../Queless/screens/Login.js';
import MyOutlets from '../Queless/screens/MyOutlets.js';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Hjemmeskærm</Text>
      <View style={{ width: '100%', gap: 12 }}>
        <Button title="Gå til Check-in" onPress={() => navigation.navigate('CheckIn')} />
        <Button title="Gå til Opret bruger" onPress={() => navigation.navigate('CreateUser')} />
        <Button title="Gå til Favoritter" onPress={() => navigation.navigate('Favorites')} />
        <Button title="Gå til Venner" onPress={() => navigation.navigate('Friends')} />
        <Button title="Gå til Log ind" onPress={() => navigation.navigate('Login')} />
        <Button title="Gå til Mine lagersalg" onPress={() => navigation.navigate('MyOutlets')} />
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Hjem">
        <Stack.Screen name="Hjem" component={HomeScreen} options={{ title: 'Hjem' }} />
        <Stack.Screen name="CheckIn" component={CheckIn} options={{ title: 'Check-in' }} />
        <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: 'Opret bruger' }} />
        <Stack.Screen name="Favorites" component={Favorites} options={{ title: 'Favoritter' }} />
        <Stack.Screen name="Friends" component={Friends} options={{ title: 'Venner' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Log ind' }} />
        <Stack.Screen name="MyOutlets" component={MyOutlets} options={{ title: 'Mine lagersalg' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

