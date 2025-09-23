import * as React from 'react';
import LoginForm from '../components/login';

export default function Login({ navigation }) {
  const [name, setName] = React.useState('');

  const goHome = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    navigation.replace('Home', { name: trimmed });
  };

  return (
    <LoginForm
      name={name}
      onChangeName={setName}
      onSubmit={goHome}
    />
  );
}