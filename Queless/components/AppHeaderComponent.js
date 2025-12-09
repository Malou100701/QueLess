import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../style/header.styles';
import BackIcon from '../assets/icons/back.png';
import LogoutIcon from '../assets/icons/logout.png';

export default function AppHeader({
  title,
  uppercase,
  showBack,
  showLogout,
}) {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  // Titel står til venstre, logout til højre, INGEN back-knap
  if (uppercase) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleUppercase}>
          {title?.toUpperCase()}
        </Text>

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

  // Back-icon til venstre, titel i midten, logout til højre
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
