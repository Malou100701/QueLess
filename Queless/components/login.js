// Malou Bjørnholt
import * as React from 'react';
import {
    Text,
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
                <Text style={styles.title}>
                    <Text style={styles.titleBold}>Velkommen til </Text>
                    <Text style={styles.titleItalic}>QueLess</Text>
                </Text>
                
                <TextInput 
                    style={styles.input}
                    placeholder="Dit navn"
                    value={name}
                    onChangeText={onChangeName}
                    onSubmitEditing={onSubmit}
                />
                 <TextInput 
                    style={styles.input}
                    placeholder="Kodeord"
                    onSubmitEditing={onSubmit}
                />

                <Button style={styles.button} title="Fortsæt" onPress={onSubmit} disabled={disabled} />
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}