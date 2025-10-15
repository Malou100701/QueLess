// Malou Bjørnholt
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';        // <-- tjek stien til din firebase-fil
import styles from '../style/login.styles';

export default function Signup() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const disabled = !email.trim() || password.length < 6;

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Bruger oprettet!', 'Du er nu oprettet og kan logge ind.');
      navigation.goBack(); // tilbage til login efter succes
    } catch (error) {
      Alert.alert('Fejl', error?.message ?? 'Noget gik galt');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background-login.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            <Text style={styles.titleBold}>Opret </Text>
            <Text style={styles.titleItalic}>QueLess</Text>
            <Text> konto</Text>
          </Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onSubmitEditing={handleSignup}
          />

          <TextInput
            placeholder="Kodeord (min. 6 tegn)"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={handleSignup}
          />

          <View style={styles.buttonWrap}>
            <TouchableOpacity
              onPress={handleSignup}
              disabled={disabled}
              style={[
                styles.button,                 // valgfri—se style-forslag herunder
                disabled && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>Opret bruger</Text>
            </TouchableOpacity>
          </View>

          {/* lille link tilbage til login */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="link"
            style={styles.registerLinkWrap}
          >
            <Text style={styles.registerLinkText}>Allerede bruger? Log ind</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
