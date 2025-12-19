import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import styles from '../style/qr.styles';

// Viser en QR-kode for en booking
export default function QRcodeComponent({ booking }) {
  // Det der skal stå inde i QR-koden (vi bruger bookingens id)
  // Hvis der ikke er et id, bruger vi en fallback tekst
  const qrValue = booking.id ? String(booking.id) : 'ingen-id';

  return (
    // Container der holder QR-koden (styling i qr.styles)
    <View style={styles.qrContainer}>
      <QRCode
        value={qrValue} // indholdet i QR-koden
        size={220}      // hvor stor QR-koden skal være
      />
    </View>
  );
}
