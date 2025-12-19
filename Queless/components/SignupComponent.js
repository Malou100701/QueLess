import { useState } from 'react';
import {
    Text, View, TextInput, KeyboardAvoidingView, Button, Platform, ImageBackground, Alert, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import styles from '../style/signup.styles';

export default function SignupComponent({ onSuccess }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const disabled = !email.trim() || password.length < 6;

    const handleSignup = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            Alert.alert('Bruger oprettet!', 'Du kan nu logge ind.');
            if (onSuccess) onSuccess();
            else if (navigation.canGoBack()) navigation.goBack(); //her tjekker du om du kan gå tilbage
            else navigation.navigate('Login'); //her navngiver du ruten til login
        } catch (err) {
            // vis gerne err.code for mere præcis fejlhåndtering
            Alert.alert('Fejl', err?.message ?? 'Noget gik galt');
            console.log('signup error:', err);
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
                        <Text style={styles.titleBold}>Opret en konto</Text>
                    </Text>

                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
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
                        <Button
                            title="Opret konto"
                            onPress={handleSignup}
                            disabled={disabled}
                        />
                    </View>

                    {/* Link til login - redirecter tilbage til login-screen */}
                    <Pressable
                        onPress={() => navigation.navigate('Login')}
                        accessibilityRole="link"
                        style={styles.SignUpLinkWrap}
                    >
                        <Text style={styles.SignUpLinkText}>Har allerede en konto? Tryk her!</Text>
                    </Pressable>

                    <Text style={[styles.SignUpLinkText, styles.footerLink]}>
                        Er du en virksomhed? Tryk her!
                    </Text>


                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
