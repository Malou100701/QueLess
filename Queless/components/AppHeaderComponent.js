/*Denne bruges til at vise en header med titel, back-knap og logout-knap, og så bliver den genbrugt på alle skærme*/
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Giver os mulighed for at skifte side i appen (gå frem/tilbage)
import styles from '../style/header.styles';
import BackIcon from '../assets/icons/back.png';
import LogoutIcon from '../assets/icons/logout.png';


// Eksporterer en komponent der kan genbruges som header på forskellige skærme
export default function AppHeader({
  title, // Tekst der vises som titel i headeren
  uppercase, // Hvis true: titel vises i uppercase-layout (titel venstre + logout højre, ingen back)
  showBack, // Hvis true: vis back-knap (tilbage-pil)
  showLogout, // Hvis true: vis logout-knap (logout-ikon)
}) {
  const navigation = useNavigation(); // “navigation” er den ting der kan sende os til en anden side

  // Det der sker når man trykker på log ud-ikonet:
  const handleLogout = () => {
    // Det sender brugeren til Login-siden
    navigation.navigate('Login');
  };

  //Hvis uppercase er blevet valgt på en side, bruger vi den version hvor titlen står til venstre
  if (uppercase) {
    return (
      // Hele headeren (en række øverst)
      <View style={styles.container}>
        <Text style={styles.titleUppercase}> 
          {title?.toUpperCase()}
        </Text>

        {/* Højre side af headeren (her kan logout-knappen være) */}
        <View style={styles.side}>
          {/* Hvis showLogout er true, viser vi logout-knappen */}
          {showLogout && (
            <TouchableOpacity onPress={handleLogout}>
              <Image source={LogoutIcon} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  //Denne version der har den tilbage-knap til venstre, titel i midten, logout til højre
  return (
    <View style={styles.container}>
      {/* Venstre side: back-knap */}
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Titel i midten */}
      <Text style={styles.title}>{title}</Text>

      {/* Højre side: logout */}
      <View style={styles.side}>
        {showLogout && (
          <TouchableOpacity onPress={handleLogout}>
            <Image source={LogoutIcon} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
