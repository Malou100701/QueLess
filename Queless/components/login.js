import * as React from 'react';
import {
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

export default function LoginForm({ name, onChangeName, onSubmit }) {
  const disabled = !name.trim();

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
        onChangeText={onChangeName}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />

      <Button title="Fortsæt" onPress={onSubmit} disabled={disabled} />
    </KeyboardAvoidingView>
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
