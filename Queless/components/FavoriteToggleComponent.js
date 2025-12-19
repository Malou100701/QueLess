// Lille genbrugelig hjerte-knap.
// Viser fyldt hjerte hvis noget er favorit, ellers tomt hjerte.
// Når man trykker, kalder den onPress (fx tilføj/fjern favorit).

import { TouchableOpacity, Image } from 'react-native';
import HeartOutline from '../assets/icons/heart-outline.png';
import HeartFilled from '../assets/icons/heart-filled.png';
import styles from '../style/favoriteToggle.styles';

export default function FavoriteToggleComponent({ isFavorite, onPress }) {
  // Vælg hvilket ikon der skal vises
  const iconSource = isFavorite ? HeartFilled : HeartOutline;

  return (
    <TouchableOpacity
      style={styles.favoriteButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={iconSource}
        style={styles.favoriteIcon}
      />
    </TouchableOpacity>
  );
}
