// components/FavoriteToggleComponent.js
import { TouchableOpacity, Image } from 'react-native';
import HeartOutline from '../assets/icons/heart-outline.png';
import HeartFilled from '../assets/icons/heart-filled.png';
import styles from '../style/favoriteToggle.styles';

export default function FavoriteToggleComponent({
  isFavorite,
  onPress,
  buttonStyle,
  iconStyle,
}) {
  const iconSource = isFavorite ? HeartFilled : HeartOutline;

  return (
    <TouchableOpacity
      style={[styles.favoriteButton]}  
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={iconSource}
        style={[styles.favoriteIcon]}    
      />
    </TouchableOpacity>
  );
}
