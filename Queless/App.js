// App.js
import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Din tab-navigator ligger nu her:
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [name, setName] = React.useState('');

  const goHome = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    // send navnet med som param, hvis du vil bruge det i Home senere
    navigation.replace('Home', { name: trimmed });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Log ind</Text>

      <TextInput
        style={styles.input}
        placeholder="Dit navn"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={goHome}
      />

      <Button title="Fortsæt" onPress={goHome} disabled={!name.trim()} />
    </KeyboardAvoidingView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Log ind' }}
        />
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

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 16 },
  input: {
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});
