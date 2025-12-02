import { Pressable, ScrollView, Text } from 'react-native';
import styles from '../style/home.styles'; 

export default function QRscannerContent() {


  return (
    <ScrollView
      style={styles.page}                  
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Tjek ind med din QR-kode</Text>
      
    </ScrollView>
  );
}
