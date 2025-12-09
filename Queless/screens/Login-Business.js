import * as React from 'react';
import LoginForm from '../components/LoginBusinessComponent';

export default function Login({ navigation }) {
  const [name, setName] = React.useState('');

  const goHome = () => {
    const navn = name.trim();
    if (!navn) return;
    navigation.replace('Home-Business', { name: navn });
  };

  return (
    <LoginForm
      name={name}
      onChangeName={setName}
      onSubmit={goHome}
    />
  );
}