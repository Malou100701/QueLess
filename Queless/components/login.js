// Malou Bjørnholt
import * as React from 'react';
import {
    Text,
    View,
    TextInput,
    Button,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
} from 'react-native';
import styles from '../style/login.styles';

export default function LoginForm({ name, onChangeName, onSubmit }) {
    const disabled = !name.trim();

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
            <Text style={styles.titleBold}>Velkommen til </Text>
            <Text style={styles.titleItalic}>QueLess</Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Brugernavn"
            value={name}
            onChangeText={onChangeName}
            onSubmitEditing={onSubmit}
          />

          <TextInput
    
            style={styles.input}
            placeholder="Kodeord"
            secureTextEntry     // skjul password
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={onSubmit}
          />

          {/* WRAP knappen – Button har ingen style-prop */}
          <View style={styles.buttonWrap}>
            <Button
              title="Log ind"
              onPress={onSubmit}
              disabled={disabled}
              color="#0A84FF"   // iOS: tekstfarve, Android: baggrund
            />
          </View>
        </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}