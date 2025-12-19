import { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Platform,
  ImageBackground,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import styles from '../style/signup.styles';

// Denne komponent laver en ny bruger med email + kodeord (Firebase)
export default function SignupComponent({ onSuccess }) {
  // navigation bruges til at skifte side
  const navigation = useNavigation();

  // Gemmer det brugeren skriver
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Slår knappen fra hvis email er tom eller password er for kort
  const disabled = !email.trim() || password.length < 6;

  // Kører når brugeren trykker "Opret konto"
  const handleSignup = async () => {
    // Ekstra sikkerhed: hvis felterne ikke er ok, så gør ingenting
    if (disabled) return;

    try {
      // Opretter brugeren i Firebase
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Viser besked til brugeren
      Alert.alert('Bruger oprettet!', 'Du kan nu logge ind.');

      // Hvis du har sendt en onSuccess funktion ind, kører vi den
      if (onSuccess) onSuccess();
      // Ellers går vi tilbage hvis vi kan
      else if (navigation.canGoBack()) navigation.goBack();
      // Hvis vi ikke kan gå tilbage, går vi til Login siden
      else navigation.navigate('Login');
    } catch (err) {
      // Hvis noget går galt, viser vi en fejlbesked
      Alert.alert('Fejl', err?.message ?? 'Noget gik galt');
      console.log('signup error:', err);
    }
  };

  return (
    // Baggrundsbillede bag hele siden
    <ImageBackground
      source={require('../assets/images/background-login.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Flytter indholdet op når tastaturet kommer frem (især på iPhone) */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Overskrift */}
          <Text style={styles.title}>
            <Text style={styles.titleBold}>Opret en konto</Text>
          </Text>

          {/* Email input */}
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onSubmitEditing={handleSignup} // tryk enter -> prøv at oprette
          />

          {/* Password input */}
          <TextInput
            placeholder="Kodeord (min. 6 tegn)"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={handleSignup}
          />

          {/* Knap til at oprette konto */}
          <View style={styles.buttonWrap}>
            <Button
              title="Opret konto"
              onPress={handleSignup}
              disabled={disabled}
            />
          </View>

          {/* Link til login siden */}
          <Pressable
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="link"
            style={styles.SignUpLinkWrap}
          >
            <Text style={styles.SignUpLinkText}>
              Har allerede en konto? Tryk her!
            </Text>
          </Pressable>

          {/* Ren tekst (ikke klikbar) */}
          <Text style={[styles.SignUpLinkText, styles.footerLink]}>
            Er du en virksomhed? Tryk her!
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
