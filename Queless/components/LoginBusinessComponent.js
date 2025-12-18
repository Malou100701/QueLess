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
import styles from '../style/loginbusiness.styles';

export default function LoginForm() {
  const navigation = useNavigation();

  // Lokale felter til login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const disabled = !email.trim() || password.length < 6;

  // her logger vi ind med email og password. Der bruges async/await fordi det er et asynkront kald fordi firebase skal tjekke om brugeren findes
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Succes -> videre i appen
      navigation.replace('Home-Business'); 
    } catch (error) {
      // Vis fejlkode/-besked for lettere fejlfinding
      console.log('login error:', error?.code, error?.message);
      Alert.alert('Login fejlede', error?.message ?? 'Prøv igen.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background-business.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            <Text style={styles.titleItalic}>QueLess - </Text>
            <Text style={styles.titleBold}>Firmaportal</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onSubmitEditing={handleLogin}
          />

          <TextInput
            style={styles.input}
            placeholder="Kodeord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
          />

          <View style={styles.buttonWrap}>
            <Button
              title="Log ind"
              onPress={handleLogin}
              disabled={disabled}
              color="#0A84FF"
            />
          </View>

          <Pressable
            onPress={() => navigation.navigate('SignUpBusiness')}
            accessibilityRole="link"
            style={styles.SignUpLinkWrap}
          >
            <Text style={styles.SignUpLinkText}>Registrer en virksomhed her</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="link"
            style={styles.footerLink}
          >
            <Text style={styles.SignUpLinkText}>Er du en privatperson? Tryk her!</Text>
          </Pressable>

        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
