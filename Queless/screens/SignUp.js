// Malou Bjørnholt 
import { useNavigation } from '@react-navigation/native';
import Signup from '../components/SignupComponent';

export default function SignUp() {
  const navigation = useNavigation();

  return (
    <Signup
      onSuccess={() => {
        // hvis Register blev åbnet fra Login, så gå bare tilbage
        if (navigation.canGoBack()) navigation.goBack();
        // ellers navigér eksplicit til Login
        else navigation.navigate('Login');
      }}
    />
  );
}