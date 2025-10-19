// Malou Bjørnholt
import { useNavigation } from '@react-navigation/native'; //denne bruges til at navigere mellem skærme, f.eks. efter en succesfuld tilmelding, så kan vi sende brugeren tilbage til login skærmen
import SignupComponent from '../components/SignupComponent'; //importerer denne for at bruge den i SignUp skærmen, så vi kan genbruge koden

export default function SignUp() {
  const navigation = useNavigation();
  return (
    <SignupComponent
      onSuccess={() => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.navigate('Login'); 
      }}
    />
  );
}
