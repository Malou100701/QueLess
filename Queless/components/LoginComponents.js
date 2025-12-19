import {
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Pressable,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import styles from '../style/login.styles';

// LoginForm viser login-skærmen og logger brugeren ind med Firebase (email + password)
export default function LoginForm() {
  // navigation bruges til at skifte side (fx til Home eller SignUp)
  const navigation = useNavigation();

  // Gemmer det brugeren skriver i felterne
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hvis email er tom eller password er for kort, slår vi login-knappen fra
  const disabled = !email.trim() || password.length < 6;

  // Når brugeren trykker “Log ind” (eller trykker enter på tastaturet)
  // prøver vi at logge ind i Firebase
  const handleLogin = async () => {
    // Ekstra sikkerhed: hvis felterne ikke er gyldige, gør ingenting
    if (disabled) return;

    try {
      // Firebase tjekker om email + password passer til en eksisterende bruger
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // Hvis login lykkes, sender vi brugeren videre til appens start-side
      // replace gør at man ikke kan gå tilbage til login med back-knappen
      navigation.replace('Home');
    } catch (error) {
      // Hvis login fejler, viser vi en fejlbesked
      console.log('login error:', error?.code, error?.message);
      Alert.alert('Login fejlede', error?.message ?? 'Prøv igen.');
    }
  };

  return (
    // Baggrundsbillede bag hele login-siden
    <ImageBackground
      source={require('../assets/images/background-login.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Flytter indhold op når tastaturet åbner (især på iPhone) */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Velkomst-tekst */}
          <Text style={styles.title}>
            <Text style={styles.titleBold}>Velkommen til </Text>
            <Text style={styles.titleItalic}>QueLess</Text>
          </Text>

          {/* Email-felt */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}          // opdaterer state når man skriver
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onSubmitEditing={handleLogin}    // login når man trykker enter
          />

          {/* Password-felt */}
          <TextInput
            style={styles.input}
            placeholder="Kodeord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry                 // skjuler password
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
          />

          {/* Login-knap */}
          <View style={styles.buttonWrap}>
            <Button
              title="Log ind"
              onPress={handleLogin}
              disabled={disabled}          // slå knappen fra hvis felter er ugyldige
              color="#0A84FF"
            />
          </View>

          {/* Link til SignUp */}
          <Pressable
            onPress={() => navigation.navigate('SignUp')}
            accessibilityRole="link"
            style={styles.SignUpLinkWrap}
          >
            <Text style={styles.SignUpLinkText}>Registrer dig her</Text>
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
